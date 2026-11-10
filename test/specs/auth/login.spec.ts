import { testData } from '../../../src/data/test-data';
import { loginAs, tryToLoginAs } from '../../../src/steps';
import { validateAccountNotActivated, validateCredentialsRejected, validateLoggedIn } from '../../../src/validations';

describe('Login', () => {
  it('should log in with valid credentials @smoke', async () => {
    const user = await testData.user();

    await loginAs(user);

    await validateLoggedIn();
  });

  it('should reject an invalid password and stay on the login screen', async () => {
    const user = await testData.user();

    await tryToLoginAs({ username: user.username, password: 'Wrong!Password1' });

    await validateCredentialsRejected();
  });

  it('should not let a deactivated user log in', async () => {
    const user = await testData.deactivatedUser();

    await tryToLoginAs(user);

    await validateAccountNotActivated();
  });
});
