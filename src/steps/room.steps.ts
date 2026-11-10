import type { RoomType } from '../api';
import { TIMEOUTS } from '../config/timeouts';
import { createChannelScreen } from '../screens/create-channel.screen';
import { newMessageScreen } from '../screens/new-message.screen';
import { roomActionsScreen } from '../screens/room-actions.screen';
import { roomScreen } from '../screens/room.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { selectUsersScreen } from '../screens/select-users.screen';
import { nameOf, type Actor, type RoomRef } from './actors';
import { loginAs } from './auth.steps';

export const searchRooms = (term: string): Promise<void> => roomsListScreen.search(term);

export const openRoomFromList = async (room: RoomRef): Promise<void> => {
  await roomsListScreen.openRoom(nameOf(room));
  await roomScreen.waitForDisplayed();
};

export const openRoom = async (room: RoomRef): Promise<void> => {
  await searchRooms(nameOf(room));
  await openRoomFromList(room);
  await roomScreen.title(nameOf(room)).waitForDisplayed({ timeout: TIMEOUTS.medium });
};

export const loginAndOpenRoom = async (actor: Actor, room: RoomRef): Promise<void> => {
  await loginAs(actor);
  await openRoom(room);
};

export const createRoom = async (name: string, type: RoomType): Promise<void> => {
  await roomsListScreen.startNewMessage();
  await newMessageScreen.waitForDisplayed();
  await newMessageScreen.chooseCreateChannel();
  await selectUsersScreen.waitForDisplayed();
  await selectUsersScreen.continueWithoutMembers();
  await createChannelScreen.waitForDisplayed();
  await createChannelScreen.create(name, type);
  await roomScreen.waitForDisplayed();
};

export const joinRoom = (): Promise<void> => roomScreen.join();

export const leaveRoom = async (): Promise<void> => {
  await roomScreen.openRoomActions();
  await roomActionsScreen.waitForDisplayed();
  await roomActionsScreen.leaveRoom();
  await roomsListScreen.waitForDisplayed();
};

export const backToRoomsList = async (): Promise<void> => {
  await driver.back();
  await roomsListScreen.waitForDisplayed();
};
