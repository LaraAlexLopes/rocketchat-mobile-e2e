import { asAdmin, type Room, type RoomType } from '../api';
import { TIMEOUTS } from '../config/timeouts';
import { testData, type TestUser } from '../data/test-data';
import { roomScreen } from '../screens/room.screen';
import { roomsListScreen } from '../screens/rooms-list.screen';
import { nameOf, type RoomRef } from '../steps/actors';
import { eventually } from '../utils/eventually';

const isMember = async (room: Room, user: TestUser) =>
  (await (await asAdmin()).rooms.members(room)).includes(user.username);

export const validateRoomOpen = async (room: RoomRef): Promise<void> => {
  await roomScreen.waitForDisplayed();
  await expect(roomScreen.title(nameOf(room))).toBeDisplayed({ wait: TIMEOUTS.medium });
};

export const validateRoomListed = async (room: RoomRef): Promise<void> => {
  await expect(roomsListScreen.item(nameOf(room))).toBeDisplayed({ wait: TIMEOUTS.long });
};

export const validateRoomNotListed = async (room: RoomRef): Promise<void> => {
  await expect(roomsListScreen.item(nameOf(room))).not.toBeDisplayed({ wait: TIMEOUTS.medium });
};

export const validateRoomCreated = async (name: string, type: RoomType, owner: TestUser): Promise<void> => {
  await validateRoomOpen(name);
  const room = await testData.trackRoomCreatedInApp(name);
  expect(room.t).toBe(type === 'public' ? 'c' : 'p');
  expect(room.u?.username).toBe(owner.username);
};

export const validateMember = async (room: Room, user: TestUser): Promise<void> => {
  await eventually(() => isMember(room, user), { message: `${user.username} is not a member of ${room.name}` });
};

export const validateNotMember = async (room: Room, user: TestUser): Promise<void> => {
  await eventually(async () => !(await isMember(room, user)), {
    message: `${user.username} is still a member of ${room.name}`,
  });
};

export const validateJoined = async (room: Room, user: TestUser): Promise<void> => {
  await expect(roomScreen.joinButton).not.toBeDisplayed({ wait: TIMEOUTS.medium });
  await expect(roomScreen.composer).toBeDisplayed({ wait: TIMEOUTS.medium });
  await validateMember(room, user);
};

export const validateLeft = async (room: Room, user: TestUser): Promise<void> => {
  await validateRoomNotListed(room);
  await validateNotMember(room, user);
};

export const validateReadOnly = async (): Promise<void> => {
  await expect(roomScreen.readOnlyNotice).toBeDisplayed({ wait: TIMEOUTS.medium });
  await expect(roomScreen.composer).not.toBeDisplayed();
};

export const validateUnreadBadge = async (count: number): Promise<void> => {
  await expect(roomsListScreen.unreadBadge(count)).toBeDisplayed({ wait: TIMEOUTS.medium });
};

export const validateNoUnreadBadge = async (count: number): Promise<void> => {
  await expect(roomsListScreen.unreadBadge(count)).not.toBeDisplayed({ wait: TIMEOUTS.medium });
};
