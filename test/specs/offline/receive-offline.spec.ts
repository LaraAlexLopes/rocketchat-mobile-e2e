import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { device } from '../../../src/utils/device';
import { expectNeverDisplayed } from '../../../src/utils/expectations';

describe('Offline receiving', () => {
  afterEach(async () => {
    await device.setAirplaneMode(false);
  });

  it('should show messages received while offline once the connection is back', async () => {
    const reader = await testData.user();
    const sender = await testData.user();
    const channel = await testData.publicChannel([reader, sender]);
    const texts = [buildMessage(), buildMessage()];

    await roomFlow.loginAndOpenRoom(reader.credentials, channel.name);
    await device.setAirplaneMode(true);
    for (const text of texts) await (await sender.api()).messages.send(channel._id, text);

    await expectNeverDisplayed(roomScreen.selectors.message(texts[0]));
    await device.setAirplaneMode(false);

    for (const text of texts) {
      await expect(roomScreen.message(text)).toBeDisplayed({ wait: TIMEOUTS.long * 2 });
    }
  });
});
