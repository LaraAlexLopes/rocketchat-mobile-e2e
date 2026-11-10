import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { device } from '../../../src/utils/device';

describe('App lifecycle', () => {
  it('should keep the open conversation after going to background and back', async () => {
    const user = await testData.user();
    const channel = await testData.publicChannel([user]);
    const text = buildMessage();

    await roomFlow.loginAndOpenRoom(user.credentials, channel.name);
    await roomScreen.sendMessage(text);
    await expect(roomScreen.message(text)).toBeDisplayed({ wait: TIMEOUTS.medium });

    await device.sendToBackground(5);

    await roomScreen.waitForDisplayed();
    await expect(roomScreen.title(channel.name)).toBeDisplayed();
    await expect(roomScreen.message(text)).toBeDisplayed();
  });
});
