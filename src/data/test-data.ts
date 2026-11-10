import { asAdmin, asUser, type Api, type Credentials, type NewUser, type Room, type User } from '../api';
import type { RoomOptions, RoomType } from '../api/services/rooms.service';
import { eventually } from '../utils/eventually';
import { dataTracker } from './data-tracker';
import { buildRoomName } from './factories/room.factory';
import { buildUser } from './factories/user.factory';

export interface TestUser extends User {
  credentials: Credentials;
  api: () => Promise<Api>;
}

const createRoom = async (type: RoomType, members: TestUser[], options: RoomOptions = {}): Promise<Room> => {
  const admin = await asAdmin();
  const room = await admin.rooms.create(
    buildRoomName(),
    type,
    members.map(member => member.username),
    options,
  );
  dataTracker.trackRoom(room);
  return room;
};

export const testData = {
  async user(overrides: Partial<NewUser> = {}): Promise<TestUser> {
    const admin = await asAdmin();
    const payload = buildUser(overrides);
    const user = await admin.users.create(payload);
    dataTracker.trackUser(user);

    const credentials = { username: payload.username, password: payload.password };
    let session: Promise<Api> | undefined;
    return { ...user, credentials, api: () => (session ??= asUser(credentials)) };
  },

  async deactivatedUser(): Promise<TestUser> {
    const user = await testData.user();
    await (await asAdmin()).users.setActive(user._id, false);
    return user;
  },

  publicChannel(members: TestUser[] = []): Promise<Room> {
    return createRoom('public', members);
  },

  privateGroup(members: TestUser[] = []): Promise<Room> {
    return createRoom('private', members);
  },

  readOnlyChannel(members: TestUser[] = []): Promise<Room> {
    return createRoom('public', members, { readOnly: true });
  },

  async directMessage(from: TestUser, to: TestUser): Promise<Room> {
    return (await from.api()).rooms.createDirect(to.username);
  },

  async trackRoomCreatedInApp(name: string): Promise<Room> {
    const admin = await asAdmin();
    const room = await eventually(() => admin.rooms.findByName(name), {
      message: `room "${name}" was not found on the server`,
    });
    dataTracker.trackRoom(room);
    return room;
  },
};
