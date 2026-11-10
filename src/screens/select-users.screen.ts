import { byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class SelectUsersScreen extends BaseScreen {
  private readonly selectors = {
    submit: byTestId('selected-users-view-submit'),
  };

  constructor() {
    super('select-users-view');
  }

  async continueWithoutMembers(): Promise<void> {
    await this.tap(this.selectors.submit);
  }
}

export const selectUsersScreen = new SelectUsersScreen();
