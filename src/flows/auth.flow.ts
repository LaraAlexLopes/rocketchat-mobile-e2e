import type { Credentials } from '../api';
import { env } from '../config/env';
import { loginScreen } from '../screens/login.screen';
import { onboardingScreen } from '../screens/onboarding.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { settingsScreen } from '../screens/settings.screen';
import { sidebarScreen } from '../screens/sidebar.screen';
import { workspaceScreen } from '../screens/workspace.screen';
import { device } from '../utils/device';

export const authFlow = {
  async openLoginForm(): Promise<void> {
    await device.resetApp();
    await onboardingScreen.waitForDisplayed();
    await onboardingScreen.connectTo(env.appServerUrl);
    await workspaceScreen.waitForDisplayed();
    await workspaceScreen.openLogin();
    await loginScreen.waitForDisplayed();
  },

  async loginAs(credentials: Credentials): Promise<void> {
    await authFlow.openLoginForm();
    await loginScreen.submit(credentials);
    await device.dismissSystemDialogs();
    await roomsListScreen.waitForDisplayed();
  },

  async logout(): Promise<void> {
    await roomsListScreen.openSidebar();
    await sidebarScreen.openSettings();
    await settingsScreen.waitForDisplayed();
    await settingsScreen.logout();
    await onboardingScreen.waitForDisplayed();
  },
};
