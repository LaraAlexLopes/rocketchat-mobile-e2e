import type { Credentials } from '../api';
import { TIMEOUTS } from '../config/timeouts';
import { roomScreen } from '../screens/room.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { authFlow } from './auth.flow';

export const roomFlow = {
  async openRoom(roomName: string): Promise<void> {
    await roomsListScreen.search(roomName);
    await roomsListScreen.openRoom(roomName);
    await roomScreen.waitForDisplayed();
    await roomScreen.title(roomName).waitForDisplayed({ timeout: TIMEOUTS.medium });
  },

  async loginAndOpenRoom(credentials: Credentials, roomName: string): Promise<void> {
    await authFlow.loginAs(credentials);
    await roomFlow.openRoom(roomName);
  },
};
