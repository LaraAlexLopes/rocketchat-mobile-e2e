import { roomScreen } from '../screens/room.screen';

export const sendMessage = (text: string): Promise<void> => roomScreen.sendMessage(text);

export const editMessage = (text: string, newText: string): Promise<void> => roomScreen.editMessage(text, newText);

export const quoteMessage = (text: string, reply: string): Promise<void> => roomScreen.quoteMessage(text, reply);

export const replyInThread = (text: string, reply: string): Promise<void> => roomScreen.replyInThread(text, reply);

export const reactTo = (text: string, emoji: string): Promise<void> => roomScreen.react(text, emoji);

export const mention = (member: { username: string; name: string }): Promise<void> => roomScreen.mention(member);

export const deleteMessage = (text: string): Promise<void> => roomScreen.deleteMessage(text);

export const openMessageActions = (text: string): Promise<void> => roomScreen.openMessageActions(text);
