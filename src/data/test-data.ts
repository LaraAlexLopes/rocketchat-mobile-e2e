import { asAdmin, asUser, type Api, type Credentials, type NewUser, type Room, type User } from '../api';
import { dataTracker } from './data-tracker';
import { buildRoomName } from './factories/room.factory';
import { buildUser } from './factories/user.factory';

export interface TestUser extends User {
  credentials: Credentials;
  /** API session of this user, to act on their behalf (send messages, etc.). */
  api: () => Promise<Api>;
}

/**
 * Seeds data through the REST API, never through the UI.
 * Everything created here is tracked and deleted after each test.
 */
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

  async publicChannel(members: TestUser[] = []): Promise<Room> {
    return createRoom('public', members);
  },

  async privateGroup(members: TestUser[] = []): Promise<Room> {
    return createRoom('private', members);
  },
};

const createRoom = async (type: 'public' | 'private', members: TestUser[]): Promise<Room> => {
  const admin = await asAdmin();
  const room = await admin.rooms.create(
    buildRoomName(),
    type,
    members.map(member => member.username),
  );
  dataTracker.trackRoom(room);
  return room;
};
