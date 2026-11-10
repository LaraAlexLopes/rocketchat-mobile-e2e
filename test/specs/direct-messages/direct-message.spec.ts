import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { authFlow } from '../../../src/flows/auth.flow';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { roomsListScreen } from '../../../src/screens/rooms-list.screen';

describe('Direct messages', () => {
  it('should flag an unread direct message and clear the badge once read', async () => {
    const reader = await testData.user();
    const sender = await testData.user();
    const dm = await testData.directMessage(sender, reader);
    const text = buildMessage();
    await (await sender.api()).messages.send(dm._id, text);

    await authFlow.loginAs(reader.credentials);

    await expect(roomsListScreen.item(sender.username)).toBeDisplayed({ wait: TIMEOUTS.long });
    await expect(roomsListScreen.unreadBadge(1)).toBeDisplayed({ wait: TIMEOUTS.medium });

    await roomsListScreen.openRoom(sender.username);
    await expect(roomScreen.message(text)).toBeDisplayed({ wait: TIMEOUTS.medium });

    await roomFlow.backToRoomsList();
    await expect(roomsListScreen.unreadBadge(1)).not.toBeDisplayed({ wait: TIMEOUTS.medium });
  });
});
