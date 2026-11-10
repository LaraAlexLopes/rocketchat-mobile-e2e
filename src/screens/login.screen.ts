import type { Credentials } from '../api';
import { device } from '../utils/device';
import { byTestId, byText } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class LoginScreen extends BaseScreen {
  private readonly selectors = {
    username: byTestId('login-view-email'),
    password: byTestId('login-view-password'),
    submit: byTestId('login-view-submit'),
    credentialsRejected: byText('Your credentials were rejected! Please try again.'),
  };

  constructor() {
    super('login-view');
  }

  get credentialsRejectedMessage() {
    return $(this.selectors.credentialsRejected);
  }

  async submit({ username, password }: Credentials): Promise<void> {
    await this.fill(this.selectors.username, username);
    await this.fill(this.selectors.password, password);
    await device.hideKeyboard();
    await this.tap(this.selectors.submit);
  }
}

export const loginScreen = new LoginScreen();
