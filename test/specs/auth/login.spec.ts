import { TIMEOUTS } from '../../../src/config/timeouts';
import { testData } from '../../../src/data/test-data';
import { authFlow } from '../../../src/flows/auth.flow';
import { loginScreen } from '../../../src/screens/login.screen';
import { roomsListScreen } from '../../../src/screens/rooms-list.screen';
import { expectNeverDisplayed } from '../../../src/utils/expectations';

describe('Login', () => {
  it('should log in with valid credentials @smoke', async () => {
    const user = await testData.user();

    await authFlow.openLoginForm();
    await loginScreen.submit(user.credentials);

    await expect(roomsListScreen.root).toBeDisplayed({ wait: TIMEOUTS.long });
  });

  it('should reject an invalid password and stay on the login screen', async () => {
    const user = await testData.user();

    await authFlow.openLoginForm();
    await loginScreen.submit({ username: user.username, password: 'Wrong!Password1' });

    await expect(loginScreen.credentialsRejectedMessage).toBeDisplayed({ wait: TIMEOUTS.medium });
    await expect(roomsListScreen.root).not.toBeDisplayed();
  });

  it('should not let a deactivated user log in', async () => {
    const user = await testData.deactivatedUser();

    await authFlow.openLoginForm();
    await loginScreen.submit(user.credentials);

    await expectNeverDisplayed(roomsListScreen.rootSelector);
    await expect(loginScreen.root).toBeDisplayed();
  });
});
