import { asAdmin } from '../../../src/api';
import { TIMEOUTS } from '../../../src/config/timeouts';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { roomsListScreen } from '../../../src/screens/rooms-list.screen';
import { eventually } from '../../../src/utils/eventually';

describe('Channel membership', () => {
  it('should join a public channel from its preview', async () => {
    const user = await testData.user();
    const channel = await testData.publicChannel();

    await roomFlow.loginAndOpenRoom(user.credentials, channel.name);
    await roomScreen.join();

    await expect(roomScreen.joinButton).not.toBeDisplayed({ wait: TIMEOUTS.medium });
    await expect(roomScreen.composer).toBeDisplayed({ wait: TIMEOUTS.medium });
    const admin = await asAdmin();
    await eventually(async () => (await admin.rooms.members(channel)).includes(user.username), {
      message: `${user.username} is not a member of ${channel.name}`,
    });
  });

  it('should leave a channel and lose its membership', async () => {
    const user = await testData.user();
    const channel = await testData.publicChannel([user]);

    await roomFlow.loginAndOpenRoom(user.credentials, channel.name);
    await roomFlow.leaveCurrentRoom();

    await expect(roomsListScreen.item(channel.name)).not.toBeDisplayed({ wait: TIMEOUTS.medium });
    const admin = await asAdmin();
    await eventually(async () => !(await admin.rooms.members(channel)).includes(user.username), {
      message: `${user.username} is still a member of ${channel.name}`,
    });
  });

  it('should not let a regular member post in a read-only channel', async () => {
    const user = await testData.user();
    const channel = await testData.readOnlyChannel([user]);

    await roomFlow.loginAndOpenRoom(user.credentials, channel.name);

    await expect(roomScreen.readOnlyNotice).toBeDisplayed({ wait: TIMEOUTS.medium });
    await expect(roomScreen.composer).not.toBeDisplayed();
  });
});
