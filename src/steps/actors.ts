import type { Credentials } from '../api';

export type Actor = Credentials | { credentials: Credentials };

export type RoomRef = string | { name: string };

export const credentialsOf = (actor: Actor): Credentials => ('credentials' in actor ? actor.credentials : actor);

export const nameOf = (room: RoomRef): string => (typeof room === 'string' ? room : room.name);
