import { asAdmin, type Message, type Room } from '../api';
import { TIMEOUTS } from '../config/timeouts';
import type { TestUser } from '../data/test-data';
import { roomScreen, type MessageAction } from '../screens/room.screen';
import { eventually } from '../utils/eventually';
import { expectNeverDisplayed } from '../utils/expectations';

const storedMessages = async (room: Room) => (await asAdmin()).messages.list(room);

const storedMessage = async (messageId: string) => (await asAdmin()).messages.get(messageId);

export const validateMessageDisplayed = async (text: string): Promise<void> => {
  await expect(roomScreen.message(text)).toBeDisplayed({ wait: TIMEOUTS.medium });
};

export const validateMessageNeverArrives = async (text: string): Promise<void> => {
  await expectNeverDisplayed(roomScreen.selectors.message(text));
};

export const validateMessageStored = async (room: Room, text: string, author: TestUser): Promise<Message> => {
  const stored = await eventually(async () => (await storedMessages(room)).find(message => message.msg === text), {
    message: `message "${text}" was not stored on the server`,
  });
  expect(stored.u.username).toBe(author.username);
  return stored;
};

export const validateMessageSent = async (room: Room, text: string, author: TestUser): Promise<void> => {
  await validateMessageDisplayed(text);
  await expect(roomScreen.messageError(text)).not.toBeDisplayed();
  await validateMessageStored(room, text, author);
};

export const validateMessageNotDelivered = async (room: Room, text: string): Promise<void> => {
  await validateMessageDisplayed(text);
  await expect(roomScreen.messageError(text)).toBeDisplayed({ wait: TIMEOUTS.long });
  expect((await storedMessages(room)).some(message => message.msg === text)).toBe(false);
};

export const validateMessageDeleted = async (message: Pick<Message, '_id' | 'msg'>): Promise<void> => {
  await expect(roomScreen.message(message.msg)).not.toBeDisplayed({ wait: TIMEOUTS.medium });
  await eventually(async () => (await storedMessage(message._id)) === undefined, {
    message: `message "${message.msg}" is still stored on the server`,
  });
};

export const validateMessageEdited = async (original: Message, newText: string): Promise<void> => {
  await validateMessageDisplayed(newText);
  const stored = await eventually(async () => {
    const message = await storedMessage(original._id);
    return message?.msg === newText ? message : undefined;
  });
  expect(stored.editedAt).toBeDefined();
};

export const validateQuote = async (room: Room, quoted: Message, reply: string, author: TestUser): Promise<void> => {
  await expect(roomScreen.quote(quoted._id, reply)).toBeDisplayed({ wait: TIMEOUTS.medium });
  const stored = await eventually(async () =>
    (await storedMessages(room)).find(message => message.msg.includes(reply)),
  );
  expect(stored.msg).toContain(`?msg=${quoted._id})`);
  expect(stored.u.username).toBe(author.username);
};

export const validateReaction = async (message: Message, emoji: string, user: TestUser): Promise<void> => {
  await expect(roomScreen.reaction(emoji)).toBeDisplayed({ wait: TIMEOUTS.medium });
  await eventually(
    async () => (await storedMessage(message._id))?.reactions?.[`:${emoji}:`]?.usernames.includes(user.username),
    { message: `reaction :${emoji}: from ${user.username} was not stored` },
  );
};

export const validateThreadReply = async (room: Room, root: Message, reply: string): Promise<void> => {
  await validateMessageDisplayed(reply);
  const stored = await eventually(async () => (await storedMessages(room)).find(message => message.msg === reply));
  expect(stored.tmid).toBe(root._id);
};

export const validateMention = async (room: Room, author: TestUser, mentioned: TestUser): Promise<void> => {
  await eventually(
    async () =>
      (await storedMessages(room)).some(
        message =>
          message.u.username === author.username &&
          message.mentions?.some(mention => mention.username === mentioned.username),
      ),
    { message: `no message from ${author.username} mentions ${mentioned.username}` },
  );
};

export const validateActionAvailable = async (action: MessageAction, available: boolean): Promise<void> => {
  expect(await roomScreen.isActionAvailable(action)).toBe(available);
};

export const validateCannotDelete = async (message: Message): Promise<void> => {
  await validateActionAvailable('quote', true);
  await validateActionAvailable('delete', false);
  expect(await storedMessage(message._id)).toBeDefined();
};
