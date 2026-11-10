import type { RoomType } from '../api';
import { device } from '../utils/device';
import { byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class CreateChannelScreen extends BaseScreen {
  private readonly selectors = {
    name: byTestId('create-channel-name'),
    typeSwitch: byTestId('create-channel-type'),
    submit: byTestId('create-channel-submit'),
  };

  constructor() {
    super('create-channel-view');
  }

  async create(name: string, type: RoomType): Promise<void> {
    await this.fill(this.selectors.name, name);
    await device.hideKeyboard();
    if (type === 'public') await this.tap(this.selectors.typeSwitch);
    await this.tap(this.selectors.submit);
  }
}

export const createChannelScreen = new CreateChannelScreen();
