import type { Credentials } from '../api';
import { env } from '../config/env';
import { loginScreen } from '../screens/login.screen';
import { onboardingScreen } from '../screens/onboarding.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { workspaceScreen } from '../screens/workspace.screen';
import { device } from '../utils/device';

export const authFlow = {
  /** Fresh app → connect to the test server → login form. */
  async openLoginForm(): Promise<void> {
    await device.resetApp();
    await onboardingScreen.waitForDisplayed();
    await onboardingScreen.connectTo(env.appServerUrl);
    await workspaceScreen.waitForDisplayed();
    await workspaceScreen.openLogin();
    await loginScreen.waitForDisplayed();
  },

  /** Full login through the UI, ending on the rooms list. */
  async loginAs(credentials: Credentials): Promise<void> {
    await authFlow.openLoginForm();
    await loginScreen.submit(credentials);
    await device.dismissSystemDialogs();
    await roomsListScreen.waitForDisplayed();
  },
};
