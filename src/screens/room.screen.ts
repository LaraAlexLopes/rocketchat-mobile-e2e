import { TIMEOUTS } from '../config/timeouts';
import { device } from '../utils/device';
import { byButtonText, byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class RoomScreen extends BaseScreen {
  private readonly selectors = {
    title: (roomName: string) => byTestId(`room-view-title-${roomName}`),
    composer: byTestId('message-composer-input'),
    sendButton: byTestId('message-composer-send'),
    message: (text: string) => byTestId(`message-content-${text}`),
    messageError: (text: string) => byTestId(`message-error-${text}`),
    actionSheet: byTestId('action-sheet'),
    actionSheetHandle: byTestId('action-sheet-handle'),
    deleteAction: byTestId('message-actions-delete'),
    confirmDeleteButton: byButtonText('Delete'),
  };

  constructor() {
    super('room-view');
  }

  title(roomName: string) {
    return $(this.selectors.title(roomName));
  }

  message(text: string) {
    return $(this.selectors.message(text));
  }

  /** Marker shown next to a message that could not be delivered to the server. */
  messageError(text: string) {
    return $(this.selectors.messageError(text));
  }

  async sendMessage(text: string): Promise<void> {
    await this.fill(this.selectors.composer, text);
    await this.tap(this.selectors.sendButton);
  }

  async deleteMessage(text: string): Promise<void> {
    const message = this.message(text);
    await message.waitForDisplayed({ timeout: TIMEOUTS.medium });
    await message.longPress();
    await $(this.selectors.actionSheet).waitForDisplayed({ timeout: TIMEOUTS.medium });

    await this.revealInActionSheet(this.selectors.deleteAction);
    await this.tap(this.selectors.deleteAction);
    await this.tap(this.selectors.confirmDeleteButton);
  }

  /**
   * Actions at the bottom of the sheet start below the fold.
   * Drags the sheet handle up to expand it, then scrolls the sheet content, until the action shows up.
   */
  private async revealInActionSheet(selector: string, attempts = 4): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const x = width / 2;
    const handle = $(this.selectors.actionSheetHandle);

    for (let attempt = 0; attempt < attempts; attempt++) {
      if (await $(selector).isDisplayed()) return;

      // First drag the handle (expands the sheet); afterwards scroll the sheet content.
      const fromY = attempt === 0 && (await handle.isDisplayed()) ? (await handle.getLocation()).y + 10 : height * 0.8;
      await device.swipe({ x, y: fromY }, { x, y: height * 0.15 });
      await driver.pause(500);
    }
    await $(selector).waitForDisplayed({ timeout: TIMEOUTS.short });
  }
}

export const roomScreen = new RoomScreen();
