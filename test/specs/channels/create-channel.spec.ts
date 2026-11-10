import type { RoomType } from '../../../src/api';
import { buildRoomName } from '../../../src/data/factories/room.factory';
import { testData } from '../../../src/data/test-data';
import { createRoom, loginAs } from '../../../src/steps';
import { validateRoomCreated } from '../../../src/validations';

const types: RoomType[] = ['public', 'private'];

describe('Create channel', () => {
  for (const type of types) {
    it(`should create a ${type} channel owned by the user`, async () => {
      const owner = await testData.user();
      const name = buildRoomName();

      await loginAs(owner);
      await createRoom(name, type);

      await validateRoomCreated(name, type, owner);
    });
  }
});
