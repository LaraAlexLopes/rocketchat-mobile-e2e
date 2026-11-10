import { scenario } from '../../../src/data/scenarios';
import { testData } from '../../../src/data/test-data';
import { backToRoomsList, loginAs, openRoomFromList } from '../../../src/steps';
import {
  validateMessageDisplayed,
  validateNoUnreadBadge,
  validateRoomListed,
  validateUnreadBadge,
} from '../../../src/validations';

describe('Direct messages', () => {
  it('should flag an unread direct message and clear the badge once read', async () => {
    const reader = await testData.user();
    const sender = await testData.user();
    const dm = await testData.directMessage(sender, reader);
    const message = await scenario.messageFrom(sender, dm);

    await loginAs(reader);
    await validateRoomListed(sender.username);
    await validateUnreadBadge(1);

    await openRoomFromList(sender.username);
    await validateMessageDisplayed(message.msg);

    await backToRoomsList();
    await validateNoUnreadBadge(1);
  });
});
