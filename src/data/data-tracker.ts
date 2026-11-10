import { ApiError, asAdmin, type Room, type User } from '../api';
import { logger } from '../utils/logger';

type TrackedRecord = { kind: 'user'; user: User } | { kind: 'room'; room: Room };

const ALREADY_DELETED = new Set(['error-invalid-user', 'error-room-not-found', 'error-invalid-room']);

class DataTracker {
  private records: TrackedRecord[] = [];

  trackUser(user: User): void {
    this.records.push({ kind: 'user', user });
  }

  trackRoom(room: Room): void {
    this.records.push({ kind: 'room', room });
  }

  get size(): number {
    return this.records.length;
  }

  async cleanup(): Promise<void> {
    if (this.records.length === 0) return;

    const admin = await asAdmin();
    const pending = [...this.records].reverse().sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'room' ? -1 : 1));
    this.records = [];
    const failures: string[] = [];

    for (const record of pending) {
      try {
        if (record.kind === 'room') await admin.rooms.delete(record.room);
        else await admin.users.delete(record.user._id);
      } catch (error) {
        if (error instanceof ApiError && ALREADY_DELETED.has(error.body.errorType ?? '')) continue;
        failures.push(`${record.kind} ${describe(record)}: ${(error as Error).message}`);
      }
    }

    logger.debug(`cleanup removed ${pending.length - failures.length}/${pending.length} records`);
    if (failures.length > 0) {
      throw new Error(`Test data cleanup failed (the sweeper will retry):\n${failures.join('\n')}`);
    }
  }
}

const describe = (record: TrackedRecord) => (record.kind === 'user' ? record.user.username : record.room.name);

export const dataTracker = new DataTracker();
