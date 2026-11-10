import { asAdmin } from '../../../src/api';
import { env } from '../../../src/config/env';
import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { eventually } from '../../../src/utils/eventually';

describe('Delete permissions', () => {
  it('should not offer a regular user the option to delete another user message', async () => {
    const reader = await testData.user();
    const author = await testData.user();
    const channel = await testData.publicChannel([reader, author]);
    const message = await (await author.api()).messages.send(channel._id, buildMessage());

    await roomFlow.loginAndOpenRoom(reader.credentials, channel.name);
    await roomScreen.openMessageActions(message.msg);

    expect(await roomScreen.isActionAvailable('quote')).toBe(true);
    expect(await roomScreen.isActionAvailable('delete')).toBe(false);
    expect(await (await asAdmin()).messages.get(message._id)).toBeDefined();
  });

  it('should let an admin delete another user message', async () => {
    const author = await testData.user();
    const channel = await testData.publicChannel([author]);
    const message = await (await author.api()).messages.send(channel._id, buildMessage());

    await roomFlow.loginAndOpenRoom(env.admin, channel.name);
    await roomScreen.deleteMessage(message.msg);

    await expect(roomScreen.message(message.msg)).not.toBeDisplayed({ wait: TIMEOUTS.medium });
    const admin = await asAdmin();
    await eventually(async () => (await admin.messages.get(message._id)) === undefined, {
      message: 'message is still stored on the server',
    });
  });
});
