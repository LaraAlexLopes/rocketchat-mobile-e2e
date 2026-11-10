import { asAdmin } from '../../../src/api';
import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { eventually } from '../../../src/utils/eventually';

describe('Delete message', () => {
  it('should remove the message from the room and from the server', async () => {
    const author = await testData.user();
    const channel = await testData.publicChannel([author]);
    const text = buildMessage();
    await (await author.api()).messages.send(channel._id, text);

    await roomFlow.loginAndOpenRoom(author.credentials, channel.name);
    await roomScreen.deleteMessage(text);

    await expect(roomScreen.message(text)).not.toBeDisplayed({ wait: TIMEOUTS.medium });

    const admin = await asAdmin();
    await eventually(async () => (await admin.messages.findByText(channel, text)) === undefined, {
      message: `message "${text}" is still stored on the server`,
    });
  });
});
