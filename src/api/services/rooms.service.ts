import type { ApiClient } from '../api-client';

export type RoomType = 'public' | 'private';

export interface Room {
  _id: string;
  name: string;
  t: 'c' | 'p' | 'd';
  ro?: boolean;
  u?: { _id: string; username: string };
}

export interface RoomOptions {
  readOnly?: boolean;
}

const endpointPrefix = (room: Pick<Room, 't'>) => (room.t === 'c' ? 'channels' : 'groups');

export class RoomsService {
  constructor(private readonly client: ApiClient) {}

  async create(name: string, type: RoomType, members: string[] = [], options: RoomOptions = {}): Promise<Room> {
    const response = await this.client.post<{ channel?: Room; group?: Room }>(
      `${type === 'public' ? 'channels' : 'groups'}.create`,
      { name, members, readOnly: options.readOnly ?? false },
    );
    const room = response.channel ?? response.group;
    if (!room) throw new Error(`Room ${name} was not returned by the API`);
    return room;
  }

  async createDirect(username: string): Promise<Room> {
    const { room } = await this.client.post<{ room: Room }>('im.create', { username });
    return room;
  }

  async delete(room: Pick<Room, '_id' | 't'>): Promise<void> {
    await this.client.post(`${endpointPrefix(room)}.delete`, { roomId: room._id });
  }

  async members(room: Pick<Room, '_id' | 't'>): Promise<string[]> {
    const { members } = await this.client.get<{ members: { username: string }[] }>(`${endpointPrefix(room)}.members`, {
      roomId: room._id,
      count: 200,
    });
    return members.map(member => member.username);
  }

  async listByPrefix(prefix: string): Promise<Room[]> {
    const { rooms } = await this.client.get<{ rooms: Room[] }>('rooms.adminRooms', {
      filter: prefix,
      types: ['c', 'p'],
      count: 500,
    });
    return rooms.filter(room => room.name?.startsWith(prefix));
  }

  async findByName(name: string): Promise<Room | undefined> {
    return (await this.listByPrefix(name)).find(room => room.name === name);
  }
}
