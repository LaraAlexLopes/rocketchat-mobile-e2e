import { device } from '../utils/device';
import { byButtonText, byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class SettingsScreen extends BaseScreen {
  private readonly selectors = {
    logout: byTestId('settings-logout'),
    confirmLogout: byButtonText('Logout'),
  };

  constructor() {
    super('settings-view');
  }

  async logout(): Promise<void> {
    await device.scrollUntilDisplayed(this.selectors.logout);
    await this.tap(this.selectors.logout);
    await this.tap(this.selectors.confirmLogout);
  }
}

export const settingsScreen = new SettingsScreen();
