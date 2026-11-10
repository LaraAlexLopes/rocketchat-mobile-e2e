import { asAdmin } from '../../../src/api';
import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { device } from '../../../src/utils/device';

describe('Offline messaging', () => {
  afterEach(async () => {
    await device.setAirplaneMode(false);
  });

  it('should flag a message sent without network as not delivered', async () => {
    const author = await testData.user();
    const channel = await testData.publicChannel([author]);
    const text = buildMessage();

    await roomFlow.loginAndOpenRoom(author.credentials, channel.name);
    await device.setAirplaneMode(true);
    await roomScreen.sendMessage(text);

    await expect(roomScreen.message(text)).toBeDisplayed({ wait: TIMEOUTS.medium });
    await expect(roomScreen.messageError(text)).toBeDisplayed({ wait: TIMEOUTS.long });

    const stored = await (await asAdmin()).messages.findByText(channel, text);
    expect(stored).toBeUndefined();
  });
});
