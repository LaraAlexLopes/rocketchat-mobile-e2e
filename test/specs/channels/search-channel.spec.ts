import { TIMEOUTS } from '../../../src/config/timeouts';
import { runPrefix } from '../../../src/data/naming';
import { testData } from '../../../src/data/test-data';
import { authFlow } from '../../../src/flows/auth.flow';
import { roomsListScreen } from '../../../src/screens/rooms-list.screen';

describe('Channel search', () => {
  it('should show public channels and hide private groups the user is not a member of', async () => {
    const user = await testData.user();
    const outsider = await testData.user();
    const publicChannel = await testData.publicChannel([user]);
    const privateGroup = await testData.privateGroup([outsider]);

    await authFlow.loginAs(user.credentials);
    // Both rooms share the run prefix, so a single search covers the positive and the negative case.
    await roomsListScreen.search(runPrefix());

    await expect(roomsListScreen.item(publicChannel.name)).toBeDisplayed({ wait: TIMEOUTS.long });
    await expect(roomsListScreen.item(privateGroup.name)).not.toBeDisplayed();
  });
});
