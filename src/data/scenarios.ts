import type { Message, Room } from '../api';
import { buildMessage } from './factories/message.factory';
import { testData, type TestUser } from './test-data';

export const scenario = {
  async userInChannel(options: { readOnly?: boolean } = {}): Promise<{ user: TestUser; channel: Room }> {
    const user = await testData.user();
    const channel = options.readOnly ? await testData.readOnlyChannel([user]) : await testData.publicChannel([user]);
    return { user, channel };
  },

  async twoUsersInChannel(): Promise<{ user: TestUser; other: TestUser; channel: Room }> {
    const [user, other] = await Promise.all([testData.user(), testData.user()]);
    return { user, other, channel: await testData.publicChannel([user, other]) };
  },

  async messageFrom(author: TestUser, room: Room, text: string = buildMessage()): Promise<Message> {
    return (await author.api()).messages.send(room._id, text);
  },
};
