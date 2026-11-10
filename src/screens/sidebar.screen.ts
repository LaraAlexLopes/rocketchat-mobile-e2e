import { BaseScreen } from './base.screen';

class SidebarScreen extends BaseScreen {
  constructor() {
    super('sidebar-settings');
  }

  async openSettings(): Promise<void> {
    await this.waitForDisplayed();
    await this.root.click();
  }
}

export const sidebarScreen = new SidebarScreen();
