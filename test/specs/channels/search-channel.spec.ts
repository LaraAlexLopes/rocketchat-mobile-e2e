import { runPrefix } from '../../../src/data/naming';
import { testData } from '../../../src/data/test-data';
import { loginAs, searchRooms } from '../../../src/steps';
import { validateRoomListed, validateRoomNotListed } from '../../../src/validations';

describe('Channel search', () => {
  it('should show public channels and hide private groups the user is not a member of', async () => {
    const user = await testData.user();
    const outsider = await testData.user();
    const publicChannel = await testData.publicChannel([user]);
    const privateGroup = await testData.privateGroup([outsider]);

    await loginAs(user);
    await searchRooms(runPrefix());

    await validateRoomListed(publicChannel);
    await validateRoomNotListed(privateGroup);
  });
});
