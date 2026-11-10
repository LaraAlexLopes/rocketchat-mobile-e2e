import { env } from '../config/env';
import { TIMEOUTS } from '../config/timeouts';
import { byButtonText, byTestId } from './selectors';

const SYSTEM_DIALOG_BUTTONS = [
  byTestId('com.android.permissioncontroller:id/permission_allow_button'),
  byTestId('android:id/autofill_save_no'),
  byTestId('android:id/aerr_wait'),
  byButtonText('Wait'),
];

const RUNTIME_PERMISSIONS = ['android.permission.POST_NOTIFICATIONS'];

const shell = (command: string, args: string[]) => driver.execute('mobile: shell', { command, args });

export const device = {
  async resetApp(): Promise<void> {
    await driver.execute('mobile: terminateApp', { appId: env.appPackage });
    await driver.execute('mobile: clearApp', { appId: env.appPackage });
    for (const permission of RUNTIME_PERMISSIONS) {
      await shell('pm', ['grant', env.appPackage, permission]);
    }
    await driver.execute('mobile: activateApp', { appId: env.appPackage });
  },

  async dismissSystemDialogs(): Promise<boolean> {
    let dismissed = false;
    for (const selector of SYSTEM_DIALOG_BUTTONS) {
      const button = await $(selector);
      if (await button.isDisplayed()) {
        await button.click();
        dismissed = true;
      }
    }
    return dismissed;
  },

  async waitForAnyAppElement(selectors: string[], description: string, timeout: number = TIMEOUTS.long): Promise<void> {
    await driver.waitUntil(
      async () => {
        for (const selector of selectors) {
          if (await $(selector).isDisplayed()) return true;
        }
        await device.dismissSystemDialogs();
        return false;
      },
      { timeout, interval: 1_000, timeoutMsg: `none of ${description} was displayed` },
    );
  },

  async waitForAppElement(selector: string, description: string, timeout: number = TIMEOUTS.long): Promise<void> {
    await driver.waitUntil(
      async () => {
        if (await $(selector).isDisplayed()) return true;
        if (await device.dismissSystemDialogs()) return false;
        await device.hideKeyboard().catch(() => undefined);
        return false;
      },
      { timeout, interval: 1_000, timeoutMsg: `${description} was not displayed` },
    );
  },

  async restartApp(): Promise<void> {
    await driver.execute('mobile: terminateApp', { appId: env.appPackage });
    await driver.execute('mobile: activateApp', { appId: env.appPackage });
  },

  async sendToBackground(seconds: number): Promise<void> {
    await driver.execute('mobile: backgroundApp', { seconds });
  },

  async scrollUntilDisplayed(selector: string, maxSwipes = 5): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    for (let swipe = 0; swipe < maxSwipes; swipe++) {
      if (await $(selector).isDisplayed()) return;
      await device.swipe({ x: width / 2, y: height * 0.75 }, { x: width / 2, y: height * 0.3 });
      await driver.pause(300);
    }
    await device.waitForAppElement(selector, selector, TIMEOUTS.short);
  },

  async swipe(from: { x: number; y: number }, to: { x: number; y: number }, durationMs = 600): Promise<void> {
    await driver
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x: Math.round(from.x), y: Math.round(from.y) })
      .down()
      .pause(100)
      .move({ duration: durationMs, x: Math.round(to.x), y: Math.round(to.y) })
      .up()
      .perform();
  },

  async setAirplaneMode(enabled: boolean): Promise<void> {
    await shell('cmd', ['connectivity', 'airplane-mode', enabled ? 'enable' : 'disable']);
    await driver.pause(TIMEOUTS.short / 2);
  },

  async hideKeyboard(): Promise<void> {
    if (await driver.isKeyboardShown()) await driver.hideKeyboard();
  },
};
