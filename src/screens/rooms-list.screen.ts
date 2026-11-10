import { TIMEOUTS } from '../config/timeouts';
import { byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class RoomsListScreen extends BaseScreen {
  private readonly selectors = {
    searchButton: byTestId('rooms-list-view-search'),
    searchInput: byTestId('rooms-list-view-search-input'),
    item: (roomName: string) => byTestId(`rooms-list-view-item-${roomName}`),
  };

  constructor() {
    super('rooms-list-view');
  }

  item(roomName: string) {
    return $(this.selectors.item(roomName));
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
}

export const roomsListScreen = new RoomsListScreen();
