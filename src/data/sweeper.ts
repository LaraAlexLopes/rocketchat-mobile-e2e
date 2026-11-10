import { asAdmin } from '../api';
import { logger } from '../utils/logger';

export const sweep = async (prefix: string): Promise<{ rooms: number; users: number }> => {
  const admin = await asAdmin();

  const rooms = await admin.rooms.listByPrefix(prefix);
  for (const room of rooms) await admin.rooms.delete(room);

  const users = await admin.users.listByPrefix(prefix);
  for (const user of users) await admin.users.delete(user._id);

  logger.info(`sweeper removed ${rooms.length} room(s) and ${users.length} user(s) with prefix "${prefix}"`);
  return { rooms: rooms.length, users: users.length };
};
