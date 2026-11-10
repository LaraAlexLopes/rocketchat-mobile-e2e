import { TIMEOUTS } from '../config/timeouts';
import { byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class RoomsListScreen extends BaseScreen {
  readonly selectors = {
    searchButton: byTestId('rooms-list-view-search'),
    searchInput: byTestId('rooms-list-view-search-input'),
    sidebarButton: byTestId('rooms-list-view-sidebar'),
    createButton: byTestId('rooms-list-view-create-channel'),
    item: (roomName: string) => byTestId(`rooms-list-view-item-${roomName}`),
    unreadBadge: (count: number) => byTestId(`unread-badge-${count}`),
  };

  constructor() {
    super('rooms-list-view');
  }

  item(roomName: string) {
    return $(this.selectors.item(roomName));
  }

  unreadBadge(count: number) {
    return $(this.selectors.unreadBadge(count));
  }

  async search(term: string): Promise<void> {
    await this.tap(this.selectors.searchButton);
    await this.fill(this.selectors.searchInput, term);
  }

  async openRoom(roomName: string): Promise<void> {
    const item = this.item(roomName);
    await item.waitForDisplayed({ timeout: TIMEOUTS.long });
    await item.click();
  }

  async openSidebar(): Promise<void> {
    await this.tap(this.selectors.sidebarButton);
  }

  async startNewMessage(): Promise<void> {
    await this.tap(this.selectors.createButton);
  }
}

export const roomsListScreen = new RoomsListScreen();
