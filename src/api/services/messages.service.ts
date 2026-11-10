import type { ApiClient } from '../api-client';
import type { Room } from './rooms.service';

export interface Message {
  _id: string;
  msg: string;
  rid: string;
  u: { _id: string; username: string };
}

export class MessagesService {
  constructor(private readonly client: ApiClient) {}

  async send(roomId: string, text: string): Promise<Message> {
    const { message } = await this.client.post<{ message: Message }>('chat.postMessage', { roomId, text });
    return message;
  }

  /** Latest messages of a room, newest first. */
  async list(room: Pick<Room, '_id' | 't'>): Promise<Message[]> {
    const endpoint = room.t === 'c' ? 'channels.messages' : 'groups.messages';
    const { messages } = await this.client.get<{ messages: Message[] }>(endpoint, { roomId: room._id, count: 100 });
    return messages;
  }

  async findByText(room: Pick<Room, '_id' | 't'>, text: string): Promise<Message | undefined> {
    return (await this.list(room)).find(message => message.msg === text);
  }
}
