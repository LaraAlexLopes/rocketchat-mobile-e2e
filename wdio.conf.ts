import { env } from './src/config/env';
import { dataTracker } from './src/data/data-tracker';
import { runId, runPrefix } from './src/data/naming';
import { sweep } from './src/data/sweeper';
import { logger } from './src/utils/logger';

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/specs/**/*.spec.ts'],
  // A single emulator runs one session at a time.
  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:udid': env.deviceName,
      'appium:app': env.apkPath,
      'appium:appPackage': env.appPackage,
      'appium:appWaitActivity': '*',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:newCommandTimeout': 240,
      'appium:disableWindowAnimation': true,
    },
  ],

  logLevel: 'warn',
  outputDir: './logs',
  waitforTimeout: 20_000,
  connectionRetryTimeout: 180_000,
  connectionRetryCount: 2,

  services: [
    [
      'appium',
      {
        // adb_shell is needed to toggle airplane mode in the offline specs.
        args: { allowInsecure: '*:adb_shell' },
        logPath: './logs',
      },
    ],
  ],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 300_000,
  },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        reportedEnvironmentVars: {
          'Rocket.Chat app': process.env.ROCKETCHAT_APP_VERSION ?? '4.78.1',
          'Rocket.Chat server': process.env.ROCKETCHAT_VERSION ?? '8.9.1',
          Device: env.deviceName,
        },
      },
    ],
  ],

  /** Launcher: fixes the run id before workers start, so all of them share the same data prefix. */
  onPrepare() {
    logger.info(`test run ${runId()} (data prefix "${runPrefix()}")`);
  },

  /** Worker: evidence on failure, then delete everything the test created. */
  async afterTest(_test, _context, { passed }) {
    if (!passed) await driver.takeScreenshot();
    try {
      await dataTracker.cleanup();
    } catch (error) {
      logger.warn((error as Error).message);
    }
  },

  /** Launcher: safety net for anything the per-test cleanup missed in this run. */
  async onComplete() {
    try {
      await sweep(runPrefix());
    } catch (error) {
      logger.warn(`sweeper failed: ${(error as Error).message}`);
    }
  },
};
