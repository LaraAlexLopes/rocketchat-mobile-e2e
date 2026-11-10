import { env } from '../config/env';
import { TIMEOUTS } from '../config/timeouts';
import { byButtonText, byTestId } from './selectors';

/** System dialogs that may cover the app on emulators (permissions, autofill, ANR). */
const SYSTEM_DIALOG_BUTTONS = [
  byTestId('com.android.permissioncontroller:id/permission_allow_button'),
  byTestId('android:id/autofill_save_no'),
  byButtonText('Wait'),
];

const shell = (command: string, args: string[]) => driver.execute('mobile: shell', { command, args });

export const device = {
  /** Starts the app from a clean state: no stored servers, sessions or cached messages. */
  async resetApp(): Promise<void> {
    await driver.execute('mobile: terminateApp', { appId: env.appPackage });
    await driver.execute('mobile: clearApp', { appId: env.appPackage });
    await driver.execute('mobile: activateApp', { appId: env.appPackage });
    await device.dismissSystemDialogs();
  },

  async dismissSystemDialogs(): Promise<void> {
    for (const selector of SYSTEM_DIALOG_BUTTONS) {
      const button = await $(selector);
      if (await button.isDisplayed()) await button.click();
    }
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
