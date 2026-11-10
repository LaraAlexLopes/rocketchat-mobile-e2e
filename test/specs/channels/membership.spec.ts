import { scenario } from '../../../src/data/scenarios';
import { testData } from '../../../src/data/test-data';
import { joinRoom, leaveRoom, loginAndOpenRoom } from '../../../src/steps';
import { validateJoined, validateLeft, validateReadOnly } from '../../../src/validations';

describe('Channel membership', () => {
  it('should join a public channel from its preview', async () => {
    const user = await testData.user();
    const channel = await testData.publicChannel();

    await loginAndOpenRoom(user, channel);
    await joinRoom();

    await validateJoined(channel, user);
  });

  it('should leave a channel and lose its membership', async () => {
    const { user, channel } = await scenario.userInChannel();

    await loginAndOpenRoom(user, channel);
    await leaveRoom();

    await validateLeft(channel, user);
  });

  it('should not let a regular member post in a read-only channel', async () => {
    const { user, channel } = await scenario.userInChannel({ readOnly: true });

    await loginAndOpenRoom(user, channel);

    await validateReadOnly();
  });
});
