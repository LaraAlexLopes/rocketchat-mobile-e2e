import { env } from './src/config/env';
import { dataTracker } from './src/data/data-tracker';
import { runId, runPrefix } from './src/data/naming';
import { sweep } from './src/data/sweeper';
import { dumpScreen } from './src/utils/diagnostics';
import { logger } from './src/utils/logger';

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/specs/**/*.spec.ts'],
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

  onPrepare() {
    logger.info(`test run ${runId()} (data prefix "${runPrefix()}")`);
  },

  async afterTest(test, _context, { passed }) {
    if (!passed) {
      await driver.takeScreenshot();
      await dumpScreen(test.title);
    }
    try {
      await dataTracker.cleanup();
    } catch (error) {
      logger.warn((error as Error).message);
    }
  },

  async onComplete() {
    try {
      await sweep(runPrefix());
    } catch (error) {
      logger.warn(`sweeper failed: ${(error as Error).message}`);
    }
  },
};
