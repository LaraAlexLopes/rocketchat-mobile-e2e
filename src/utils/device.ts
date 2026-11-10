import { env } from '../config/env';
import { TIMEOUTS } from '../config/timeouts';
import { byButtonText, byTestId } from './selectors';

/** System dialogs that may cover the app on emulators (permissions, autofill, ANR). */
const SYSTEM_DIALOG_BUTTONS = [
  byTestId('com.android.permissioncontroller:id/permission_allow_button'),
  byTestId('android:id/autofill_save_no'),
  byButtonText('Wait'),
];

/** Runtime permissions the app asks for on first launch. Granting them up front avoids the dialogs. */
const RUNTIME_PERMISSIONS = ['android.permission.POST_NOTIFICATIONS'];

const shell = (command: string, args: string[]) => driver.execute('mobile: shell', { command, args });

export const device = {
  /**
   * Starts the app from a clean state: no stored servers, sessions or cached messages.
   * Clearing app data also revokes runtime permissions, so they are granted again before launch.
   */
  async resetApp(): Promise<void> {
    await driver.execute('mobile: terminateApp', { appId: env.appPackage });
    await driver.execute('mobile: clearApp', { appId: env.appPackage });
    for (const permission of RUNTIME_PERMISSIONS) {
      await shell('pm', ['grant', env.appPackage, permission]);
    }
    await driver.execute('mobile: activateApp', { appId: env.appPackage });
  },

  /** Taps away any system dialog currently on screen. Returns true if one was dismissed. */
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

  /**
   * Waits for an app element while dismissing system dialogs that may appear on top of it at any moment
   * (they are asynchronous, so a single check right after launch is not enough).
   */
  async waitForAppElement(selector: string, description: string, timeout: number = TIMEOUTS.long): Promise<void> {
    await driver.waitUntil(
      async () => {
        if (await $(selector).isDisplayed()) return true;
        await device.dismissSystemDialogs();
        return false;
      },
      { timeout, interval: 1_000, timeoutMsg: `${description} was not displayed` },
    );
  },

  /** Finger swipe between two points, in screen coordinates. */
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

  /** Requires Appium's `adb_shell` insecure feature (enabled in wdio.conf.ts). */
  async setAirplaneMode(enabled: boolean): Promise<void> {
    await shell('cmd', ['connectivity', 'airplane-mode', enabled ? 'enable' : 'disable']);
    await driver.pause(TIMEOUTS.short / 2); // give the OS time to drop or restore the connection
  },

  async hideKeyboard(): Promise<void> {
    if (await driver.isKeyboardShown()) await driver.hideKeyboard();
  },
};
