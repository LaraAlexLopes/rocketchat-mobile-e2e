import type { ApiClient } from '../api-client';
import type { Room } from './rooms.service';

export interface Message {
  _id: string;
  msg: string;
  rid: string;
  u: { _id: string; username: string };
  tmid?: string;
  editedAt?: string;
  reactions?: Record<string, { usernames: string[] }>;
  mentions?: { username: string }[];
  attachments?: unknown[];
}

const historyEndpoint: Record<Room['t'], string> = {
  c: 'channels.messages',
  p: 'groups.messages',
  d: 'im.messages',
};

export class MessagesService {
  constructor(private readonly client: ApiClient) {}

  async send(roomId: string, text: string): Promise<Message> {
    const { message } = await this.client.post<{ message: Message }>('chat.postMessage', { roomId, text });
    return message;
  }

  async get(messageId: string): Promise<Message | undefined> {
    try {
      const { message } = await this.client.get<{ message: Message }>('chat.getMessage', { msgId: messageId });
      return message;
    } catch {
      return undefined;
    }
  }

  async list(room: Pick<Room, '_id' | 't'>): Promise<Message[]> {
    const { messages } = await this.client.get<{ messages: Message[] }>(historyEndpoint[room.t], {
      roomId: room._id,
      count: 100,
    });
    return messages;
  }

  async findByText(room: Pick<Room, '_id' | 't'>, text: string): Promise<Message | undefined> {
    return (await this.list(room)).find(message => message.msg === text);
  }
}
