import { env } from '../config/env';
import { loginScreen } from '../screens/login.screen';
import { onboardingScreen } from '../screens/onboarding.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { settingsScreen } from '../screens/settings.screen';
import { sidebarScreen } from '../screens/sidebar.screen';
import { workspaceScreen } from '../screens/workspace.screen';
import { device } from '../utils/device';
import { credentialsOf, type Actor } from './actors';

export const openLoginForm = async (): Promise<void> => {
  await device.resetApp();
  await onboardingScreen.waitForDisplayed();
  await onboardingScreen.connectTo(env.appServerUrl);
  await workspaceScreen.waitForDisplayed();
  await workspaceScreen.openLogin();
  await loginScreen.waitForDisplayed();
};

export const submitLogin = (actor: Actor): Promise<void> => loginScreen.submit(credentialsOf(actor));

export const tryToLoginAs = async (actor: Actor): Promise<void> => {
  await openLoginForm();
  await submitLogin(actor);
};

export const loginAs = async (actor: Actor): Promise<void> => {
  await tryToLoginAs(actor);
  await device.dismissSystemDialogs();
  await roomsListScreen.waitForDisplayed();
};

export const waitForLoggedOutScreen = (): Promise<void> =>
  device.waitForAnyAppElement(
    [onboardingScreen.rootSelector, workspaceScreen.rootSelector, loginScreen.rootSelector],
    'the onboarding, workspace or login screens',
  );

export const logout = async (): Promise<void> => {
  await roomsListScreen.openSidebar();
  await sidebarScreen.openSettings();
  await settingsScreen.waitForDisplayed();
  await settingsScreen.logout();
  await waitForLoggedOutScreen();
};

export const restartApp = (): Promise<void> => device.restartApp();

export const sendAppToBackground = (seconds = 5): Promise<void> => device.sendToBackground(seconds);
