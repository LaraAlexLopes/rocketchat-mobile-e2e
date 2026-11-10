import assert from 'node:assert/strict';

import { ApiError, asAdmin, asUser } from '../../src/api';
import { dataTracker } from '../../src/data/data-tracker';
import { buildRoomName } from '../../src/data/factories/room.factory';
import { buildUser } from '../../src/data/factories/user.factory';
import { runPrefix } from '../../src/data/naming';
import { sweep } from '../../src/data/sweeper';
import { testData } from '../../src/data/test-data';

const userExists = async (username: string): Promise<boolean> => {
  const admin = await asAdmin();
  try {
    await admin.client.get('users.info', { username });
    return true;
  } catch (error) {
    if (error instanceof ApiError) return false;
    throw error;
  }
};

describe('Test data lifecycle', () => {
  afterEach(() => dataTracker.cleanup());

  it('should create a user tagged with the run prefix that can log in', async () => {
    const user = await testData.user();

    assert.ok(user.username.startsWith(runPrefix()), `${user.username} should start with ${runPrefix()}`);
    const session = await asUser(user.credentials);
    assert.equal(session.client.userId, user._id);
  });

  it('should delete every tracked user and room on cleanup', async () => {
    const member = await testData.user();
    const channel = await testData.publicChannel([member]);
    const admin = await asAdmin();

    await dataTracker.cleanup();

    assert.equal(await userExists(member.username), false);
    assert.equal((await admin.rooms.listByPrefix(channel.name)).length, 0);
    assert.equal(dataTracker.size, 0);
  });

  it('should not fail when a tracked record was already deleted', async () => {
    const user = await testData.user();
    await (await asAdmin()).users.delete(user._id);

    await assert.doesNotReject(dataTracker.cleanup());
  });

  it('should sweep leftovers that were never tracked', async () => {
    const admin = await asAdmin();
    const orphanUser = await admin.users.create(buildUser());
    const orphanRoom = await admin.rooms.create(buildRoomName(), 'private');

    const removed = await sweep(runPrefix());

    assert.ok(removed.users >= 1 && removed.rooms >= 1);
    assert.equal(await userExists(orphanUser.username), false);
    assert.equal((await admin.rooms.listByPrefix(orphanRoom.name)).length, 0);
  });

  it('should store a message sent by a seeded user', async () => {
    const author = await testData.user();
    const channel = await testData.publicChannel([author]);

    const sent = await (await author.api()).messages.send(channel._id, 'hello from the data layer');
    const stored = await (await asAdmin()).messages.findByText(channel, 'hello from the data layer');

    assert.equal(stored?._id, sent._id);
    assert.equal(stored?.u.username, author.username);
  });

  it('should block login for a deactivated user', async () => {
    const user = await testData.deactivatedUser();

    await assert.rejects(asUser(user.credentials), (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.status, 401);
      return true;
    });
  });

  it('should reject messages from regular members in a read-only channel', async () => {
    const member = await testData.user();
    const channel = await testData.readOnlyChannel([member]);

    await assert.rejects((await member.api()).messages.send(channel._id, 'not allowed'), ApiError);
    assert.ok(channel.ro);
  });

  it('should list the members of a seeded room', async () => {
    const member = await testData.user();
    const channel = await testData.publicChannel([member]);

    assert.ok((await (await asAdmin()).rooms.members(channel)).includes(member.username));
  });

  it('should exchange direct messages between seeded users', async () => {
    const sender = await testData.user();
    const recipient = await testData.user();
    const dm = await testData.directMessage(sender, recipient);

    await (await sender.api()).messages.send(dm._id, 'hello in private');
    const history = await (await recipient.api()).messages.list(dm);

    assert.equal(dm.t, 'd');
    assert.ok(history.some(message => message.msg === 'hello in private'));
  });

  it('should find and track a room created outside the data layer', async () => {
    const owner = await testData.user();
    const name = buildRoomName();
    await (await owner.api()).rooms.create(name, 'private');

    const room = await testData.trackRoomCreatedInApp(name);
    await dataTracker.cleanup();

    assert.equal(room.u?.username, owner.username);
    assert.equal(await (await asAdmin()).rooms.findByName(name), undefined);
  });
});
