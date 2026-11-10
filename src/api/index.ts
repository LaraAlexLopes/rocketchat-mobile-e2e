import { env } from '../config/env';
import { ApiClient, type Credentials } from './api-client';
import { MessagesService } from './services/messages.service';
import { RoomsService } from './services/rooms.service';
import { UsersService } from './services/users.service';

export { ApiClient, ApiError, type Credentials } from './api-client';
export type { Message } from './services/messages.service';
export type { Room, RoomType } from './services/rooms.service';
export type { NewUser, User } from './services/users.service';

export const servicesFor = (client: ApiClient) => ({
  client,
  users: new UsersService(client),
  rooms: new RoomsService(client),
  messages: new MessagesService(client),
});

export type Api = ReturnType<typeof servicesFor>;

let adminApi: Promise<Api> | undefined;

export const asAdmin = (): Promise<Api> => {
  adminApi ??= ApiClient.login(env.admin).then(servicesFor);
  return adminApi;
};

export const asUser = async (credentials: Credentials): Promise<Api> => servicesFor(await ApiClient.login(credentials));
