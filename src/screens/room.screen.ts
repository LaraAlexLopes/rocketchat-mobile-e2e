import { TIMEOUTS } from '../config/timeouts';
import { device } from '../utils/device';
import { byButtonText, byTestId, byTestIdContainingAll, byText } from '../utils/selectors';
import { BaseScreen } from './base.screen';

export type MessageAction = 'edit' | 'quote' | 'delete';

class RoomScreen extends BaseScreen {
  readonly selectors = {
    title: (roomName: string) => byTestId(`room-view-title-${roomName}`),
    header: byTestId('room-header'),
    composer: byTestId('message-composer-input'),
    threadComposer: byTestId('message-composer-input-thread'),
    sendButton: byTestId('message-composer-send'),
    joinButton: byTestId('room-view-join-button'),
    readOnlyNotice: byText('This room is read only'),
    message: (text: string) => byTestId(`message-content-${text}`),
    messageError: (text: string) => byTestId(`message-error-${text}`),
    quote: (quotedMessageId: string, reply: string) =>
      byTestIdContainingAll('message-content-', `?msg=${quotedMessageId})`, reply),
    reaction: (emoji: string) => byTestId(`message-reaction-:${emoji}:`),
    autocompleteItem: (value: string) => byTestId(`autocomplete-item-${value}`),
    actionSheet: byTestId('action-sheet'),
    actionSheetHandle: byTestId('action-sheet-handle'),
    action: (action: MessageAction) => byTestId(`message-actions-${action}`),
    replyInThread: byText('Reply in thread'),
    addReaction: byTestId('add-reaction'),
    emojiTab: byTestId('emoji-picker-tab-emoji'),
    emoji: (emoji: string) => byTestId(`emoji-${emoji}`),
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

  messageError(text: string) {
    return $(this.selectors.messageError(text));
  }

  quote(quotedMessageId: string, reply: string) {
    return $(this.selectors.quote(quotedMessageId, reply));
  }

  reaction(emoji: string) {
    return $(this.selectors.reaction(emoji));
  }

  get composer() {
    return $(this.selectors.composer);
  }

  get joinButton() {
    return $(this.selectors.joinButton);
  }

  get readOnlyNotice() {
    return $(this.selectors.readOnlyNotice);
  }

  async sendMessage(text: string): Promise<void> {
    await this.fill(this.selectors.composer, text);
    await this.tap(this.selectors.sendButton);
  }

  async join(): Promise<void> {
    await this.tap(this.selectors.joinButton);
  }

  async openRoomActions(): Promise<void> {
    await this.tap(this.selectors.header);
  }

  async openMessageActions(text: string): Promise<void> {
    await device.waitForAppElement(this.selectors.message(text), `message "${text}"`, TIMEOUTS.medium);
    await this.message(text).longPress();
    await $(this.selectors.actionSheet).waitForDisplayed({ timeout: TIMEOUTS.medium });
  }

  async isActionAvailable(action: MessageAction): Promise<boolean> {
    return this.revealInActionSheet(this.selectors.action(action));
  }

  async deleteMessage(text: string): Promise<void> {
    await this.runAction(text, 'delete');
    await this.tap(this.selectors.confirmDeleteButton);
  }

  async editMessage(text: string, newText: string): Promise<void> {
    await this.runAction(text, 'edit');
    await this.fill(this.selectors.composer, newText);
    await this.tap(this.selectors.sendButton);
  }

  async quoteMessage(text: string, reply: string): Promise<void> {
    await this.runAction(text, 'quote');
    await this.fill(this.selectors.composer, reply);
    await this.tap(this.selectors.sendButton);
  }

  async replyInThread(text: string, reply: string): Promise<void> {
    await this.openMessageActions(text);
    await this.revealInActionSheet(this.selectors.replyInThread);
    await this.tap(this.selectors.replyInThread);
    await this.fill(this.selectors.threadComposer, reply);
    await this.tap(this.selectors.sendButton);
  }

  async react(text: string, emoji: string): Promise<void> {
    await this.openMessageActions(text);
    await this.tap(this.selectors.addReaction);
    await this.tap(this.selectors.emojiTab);
    await this.tap(this.selectors.emoji(emoji));
  }

  async mention(member: { username: string; name: string }): Promise<void> {
    await this.fill(this.selectors.composer, `@${member.username}`);
    await this.tap(this.selectors.autocompleteItem(member.name));
    await this.tap(this.selectors.sendButton);
  }

  private async runAction(text: string, action: MessageAction): Promise<void> {
    await this.openMessageActions(text);
    if (!(await this.isActionAvailable(action))) {
      throw new Error(`Message action "${action}" is not available for "${text}"`);
    }
    await this.tap(this.selectors.action(action));
  }

  private async revealInActionSheet(selector: string, attempts = 4): Promise<boolean> {
    const { width, height } = await driver.getWindowSize();
    const x = width / 2;
    const handle = $(this.selectors.actionSheetHandle);

    for (let attempt = 0; attempt < attempts; attempt++) {
      if (await $(selector).isDisplayed()) return true;
      const fromY = attempt === 0 && (await handle.isDisplayed()) ? (await handle.getLocation()).y + 10 : height * 0.8;
      await device.swipe({ x, y: fromY }, { x, y: height * 0.15 });
      await driver.pause(500);
    }
    return $(selector).isDisplayed();
  }
}

export const roomScreen = new RoomScreen();
