import type { Credentials, RoomType } from '../api';
import { TIMEOUTS } from '../config/timeouts';
import { createChannelScreen } from '../screens/create-channel.screen';
import { newMessageScreen } from '../screens/new-message.screen';
import { roomActionsScreen } from '../screens/room-actions.screen';
import { roomScreen } from '../screens/room.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { selectUsersScreen } from '../screens/select-users.screen';
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

  async createRoom(name: string, type: RoomType): Promise<void> {
    await roomsListScreen.startNewMessage();
    await newMessageScreen.waitForDisplayed();
    await newMessageScreen.chooseCreateChannel();
    await selectUsersScreen.waitForDisplayed();
    await selectUsersScreen.continueWithoutMembers();
    await createChannelScreen.waitForDisplayed();
    await createChannelScreen.create(name, type);
    await roomScreen.waitForDisplayed();
    await roomScreen.title(name).waitForDisplayed({ timeout: TIMEOUTS.medium });
  },

  async leaveCurrentRoom(): Promise<void> {
    await roomScreen.openRoomActions();
    await roomActionsScreen.waitForDisplayed();
    await roomActionsScreen.leaveRoom();
    await roomsListScreen.waitForDisplayed();
  },

  async backToRoomsList(): Promise<void> {
    await driver.back();
    await roomsListScreen.waitForDisplayed();
  },
};
