import { buildMessage } from '../../../src/data/factories/message.factory';
import { scenario } from '../../../src/data/scenarios';
import { editMessage, loginAndOpenRoom, mention, quoteMessage, reactTo, replyInThread } from '../../../src/steps';
import {
  validateMention,
  validateMessageEdited,
  validateQuote,
  validateReaction,
  validateThreadReply,
} from '../../../src/validations';

describe('Message actions', () => {
  it('should edit a message and store the new text', async () => {
    const { user, channel } = await scenario.userInChannel();
    const message = await scenario.messageFrom(user, channel);
    const newText = buildMessage();

    await loginAndOpenRoom(user, channel);
    await editMessage(message.msg, newText);

    await validateMessageEdited(message, newText);
  });

  it('should quote another user message', async () => {
    const { user: reader, other: author, channel } = await scenario.twoUsersInChannel();
    const quoted = await scenario.messageFrom(author, channel);
    const reply = buildMessage();

    await loginAndOpenRoom(reader, channel);
    await quoteMessage(quoted.msg, reply);

    await validateQuote(channel, quoted, reply, reader);
  });

  it('should add a reaction that the server records for the user', async () => {
    const { user, channel } = await scenario.userInChannel();
    const message = await scenario.messageFrom(user, channel);

    await loginAndOpenRoom(user, channel);
    await reactTo(message.msg, 'grinning');

    await validateReaction(message, 'grinning', user);
  });

  it('should reply in a thread linked to the original message', async () => {
    const { user, channel } = await scenario.userInChannel();
    const root = await scenario.messageFrom(user, channel);
    const reply = buildMessage();

    await loginAndOpenRoom(user, channel);
    await replyInThread(root.msg, reply);

    await validateThreadReply(channel, root, reply);
  });

  it('should mention a room member picked from autocomplete', async () => {
    const { user: author, other: member, channel } = await scenario.twoUsersInChannel();

    await loginAndOpenRoom(author, channel);
    await mention(member);

    await validateMention(channel, author, member);
  });
});
