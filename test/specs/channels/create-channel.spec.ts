import type { RoomType } from '../../../src/api';
import { buildRoomName } from '../../../src/data/factories/room.factory';
import { testData } from '../../../src/data/test-data';
import { authFlow } from '../../../src/flows/auth.flow';
import { roomFlow } from '../../../src/flows/room.flow';

const cases: { type: RoomType; serverType: 'c' | 'p' }[] = [
  { type: 'public', serverType: 'c' },
  { type: 'private', serverType: 'p' },
];

describe('Create channel', () => {
  for (const { type, serverType } of cases) {
    it(`should create a ${type} channel owned by the user`, async () => {
      const owner = await testData.user();
      const name = buildRoomName();

      await authFlow.loginAs(owner.credentials);
      await roomFlow.createRoom(name, type);

      const room = await testData.trackRoomCreatedInApp(name);
      expect(room.t).toBe(serverType);
      expect(room.u?.username).toBe(owner.username);
    });
  }
});
