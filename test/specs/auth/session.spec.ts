import { testData } from '../../../src/data/test-data';
import { loginAs, logout, restartApp } from '../../../src/steps';
import { validateLoggedIn, validateLoggedOut } from '../../../src/validations';

describe('Session', () => {
  it('should keep the user logged in after the app restarts', async () => {
    const user = await testData.user();

    await loginAs(user);
    await restartApp();

    await validateLoggedIn();
  });

  it('should log out and stay logged out after the app restarts @smoke', async () => {
    const user = await testData.user();

    await loginAs(user);
    await logout();
    await restartApp();

    await validateLoggedOut();
  });
});
