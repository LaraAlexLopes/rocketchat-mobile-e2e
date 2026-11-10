import { asAdmin } from '../../../src/api';
import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { eventually } from '../../../src/utils/eventually';

describe('Send message', () => {
  it('should show the message in the room and persist it on the server @smoke', async () => {
    const author = await testData.user();
    const channel = await testData.publicChannel([author]);
    const text = buildMessage();

    await roomFlow.loginAndOpenRoom(author.credentials, channel.name);
    await roomScreen.sendMessage(text);

    await expect(roomScreen.message(text)).toBeDisplayed({ wait: TIMEOUTS.medium });
    await expect(roomScreen.messageError(text)).not.toBeDisplayed();

    const admin = await asAdmin();
    const stored = await eventually(() => admin.messages.findByText(channel, text), {
      message: `message "${text}" was not stored on the server`,
    });
    expect(stored.u.username).toBe(author.username);
  });
});
