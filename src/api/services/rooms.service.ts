import type { ApiClient } from '../api-client';

export type RoomType = 'public' | 'private';

export interface Room {
  _id: string;
  name: string;
  t: 'c' | 'p';
}

const endpointPrefix = (type: RoomType) => (type === 'public' ? 'channels' : 'groups');

export class RoomsService {
  constructor(private readonly client: ApiClient) {}

  async create(name: string, type: RoomType, members: string[] = []): Promise<Room> {
    const response = await this.client.post<{ channel?: Room; group?: Room }>(`${endpointPrefix(type)}.create`, {
      name,
      members,
    });
    const room = response.channel ?? response.group;
    if (!room) throw new Error(`Room ${name} was not returned by the API`);
    return room;
  }

  async delete(room: Pick<Room, '_id' | 't'>): Promise<void> {
    await this.client.post(`${room.t === 'c' ? 'channels' : 'groups'}.delete`, { roomId: room._id });
  }

  async listByPrefix(prefix: string): Promise<Room[]> {
    const { rooms } = await this.client.get<{ rooms: Room[] }>('rooms.adminRooms', {
      filter: prefix,
      types: ['c', 'p'],
      count: 500,
    });
    return rooms.filter(room => room.name?.startsWith(prefix));
  }
}
