import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';

describe('Receive message', () => {
  it('should display, in real time, a message another user sends to the room', async () => {
    const reader = await testData.user();
    const sender = await testData.user();
    const channel = await testData.publicChannel([reader, sender]);
    const text = buildMessage();

    await roomFlow.loginAndOpenRoom(reader.credentials, channel.name);
    await (await sender.api()).messages.send(channel._id, text);

    await expect(roomScreen.message(text)).toBeDisplayed({ wait: TIMEOUTS.medium });
  });
});
