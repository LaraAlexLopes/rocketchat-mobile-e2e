import { byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class NewMessageScreen extends BaseScreen {
  private readonly selectors = {
    createChannel: byTestId('new-message-view-create-channel'),
  };

  constructor() {
    super('new-message-view');
  }

  async chooseCreateChannel(): Promise<void> {
    await this.tap(this.selectors.createChannel);
  }
}

export const newMessageScreen = new NewMessageScreen();
