import { TIMEOUTS } from '../config/timeouts';
import { loginScreen } from '../screens/login.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { waitForLoggedOutScreen } from '../steps/auth.steps';
import { expectNeverDisplayed } from '../utils/expectations';

export const validateLoggedIn = async (): Promise<void> => {
  await roomsListScreen.waitForDisplayed();
};

export const validateLoggedOut = async (): Promise<void> => {
  await waitForLoggedOutScreen();
  await expectNeverDisplayed(roomsListScreen.rootSelector);
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
