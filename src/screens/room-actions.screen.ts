import { device } from '../utils/device';
import { byButtonText, byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class RoomActionsScreen extends BaseScreen {
  private readonly selectors = {
    leave: byTestId('room-actions-leave-channel'),
    confirmLeave: byButtonText('Yes, leave it!'),
  };

  constructor() {
    super('room-actions-view');
  }

  async leaveRoom(): Promise<void> {
    await device.scrollUntilDisplayed(this.selectors.leave);
    await this.tap(this.selectors.leave);
    await this.tap(this.selectors.confirmLeave);
  }
}

export const roomActionsScreen = new RoomActionsScreen();
