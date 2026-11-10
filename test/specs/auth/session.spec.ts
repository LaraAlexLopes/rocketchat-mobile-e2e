import { testData } from '../../../src/data/test-data';
import { authFlow } from '../../../src/flows/auth.flow';
import { onboardingScreen } from '../../../src/screens/onboarding.screen';
import { roomsListScreen } from '../../../src/screens/rooms-list.screen';
import { device } from '../../../src/utils/device';

describe('Session', () => {
  it('should keep the user logged in after the app restarts', async () => {
    const user = await testData.user();

    await authFlow.loginAs(user.credentials);
    await device.restartApp();

    await roomsListScreen.waitForDisplayed();
  });

  it('should log out and return to the workspace screen @smoke', async () => {
    const user = await testData.user();

    await authFlow.loginAs(user.credentials);
    await authFlow.logout();

    await expect(onboardingScreen.root).toBeDisplayed();
    await device.restartApp();
    await onboardingScreen.waitForDisplayed();
  });
});
