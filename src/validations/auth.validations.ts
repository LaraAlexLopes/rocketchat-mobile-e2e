import { TIMEOUTS } from '../config/timeouts';
import { loginScreen } from '../screens/login.screen';
import { onboardingScreen } from '../screens/onboarding.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { expectNeverDisplayed } from '../utils/expectations';

export const validateLoggedIn = async (): Promise<void> => {
  await roomsListScreen.waitForDisplayed();
};

export const validateLoggedOut = async (): Promise<void> => {
  await onboardingScreen.waitForDisplayed();
};

export const validateCredentialsRejected = async (): Promise<void> => {
  await expect(loginScreen.credentialsRejectedMessage).toBeDisplayed({ wait: TIMEOUTS.medium });
  await expect(roomsListScreen.root).not.toBeDisplayed();
};

export const validateAccountNotActivated = async (): Promise<void> => {
  await expect(loginScreen.accountNotActivatedMessage).toBeDisplayed({ wait: TIMEOUTS.medium });
  await loginScreen.dismissAlert();
  await expectNeverDisplayed(roomsListScreen.rootSelector);
  await expect(loginScreen.root).toBeDisplayed();
};
