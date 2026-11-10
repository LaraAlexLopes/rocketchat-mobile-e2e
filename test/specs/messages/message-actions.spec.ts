import { asAdmin } from '../../../src/api';
import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { eventually } from '../../../src/utils/eventually';

describe('Message actions', () => {
  it('should edit a message and store the new text', async () => {
    const author = await testData.user();
    const channel = await testData.publicChannel([author]);
    const original = await (await author.api()).messages.send(channel._id, buildMessage());
    const edited = buildMessage();

    await roomFlow.loginAndOpenRoom(author.credentials, channel.name);
    await roomScreen.editMessage(original.msg, edited);

    await expect(roomScreen.message(edited)).toBeDisplayed({ wait: TIMEOUTS.medium });
    const admin = await asAdmin();
    const stored = await eventually(async () => {
      const message = await admin.messages.get(original._id);
      return message?.msg === edited ? message : undefined;
    });
    expect(stored.editedAt).toBeDefined();
  });

  it('should quote another user message', async () => {
    const reader = await testData.user();
    const author = await testData.user();
    const channel = await testData.publicChannel([reader, author]);
    const original = await (await author.api()).messages.send(channel._id, buildMessage());
    const reply = buildMessage();

    await roomFlow.loginAndOpenRoom(reader.credentials, channel.name);
    await roomScreen.quoteMessage(original.msg, reply);

    await expect(roomScreen.quoteOf(author.name, original.msg)).toBeDisplayed({ wait: TIMEOUTS.medium });
    const admin = await asAdmin();
    const stored = await eventually(() => admin.messages.findByText(channel, reply));
    expect(stored.attachments?.length).toBeGreaterThan(0);
  });

  it('should add a reaction that the server records for the user', async () => {
    const user = await testData.user();
    const channel = await testData.publicChannel([user]);
    const message = await (await user.api()).messages.send(channel._id, buildMessage());

    await roomFlow.loginAndOpenRoom(user.credentials, channel.name);
    await roomScreen.react(message.msg, 'grinning');

    await expect(roomScreen.reaction('grinning')).toBeDisplayed({ wait: TIMEOUTS.medium });
    const admin = await asAdmin();
    await eventually(
      async () => (await admin.messages.get(message._id))?.reactions?.[':grinning:']?.usernames.includes(user.username),
      { message: 'reaction was not stored on the server' },
    );
  });

  it('should reply in a thread linked to the original message', async () => {
    const user = await testData.user();
    const channel = await testData.publicChannel([user]);
    const root = await (await user.api()).messages.send(channel._id, buildMessage());
    const reply = buildMessage();

    await roomFlow.loginAndOpenRoom(user.credentials, channel.name);
    await roomScreen.replyInThread(root.msg, reply);

    await expect(roomScreen.message(reply)).toBeDisplayed({ wait: TIMEOUTS.medium });
    const admin = await asAdmin();
    const stored = await eventually(() => admin.messages.findByText(channel, reply));
    expect(stored.tmid).toBe(root._id);
  });

  it('should mention a room member picked from autocomplete', async () => {
    const author = await testData.user();
    const mentioned = await testData.user();
    const channel = await testData.publicChannel([author, mentioned]);

    await roomFlow.loginAndOpenRoom(author.credentials, channel.name);
    await roomScreen.mention(mentioned.username);

    const admin = await asAdmin();
    await eventually(
      async () =>
        (await admin.messages.list(channel)).some(
          message =>
            message.u.username === author.username &&
            message.mentions?.some(mention => mention.username === mentioned.username),
        ),
      { message: `no message from ${author.username} mentions ${mentioned.username}` },
    );
  });
});
