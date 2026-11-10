import { scenario } from '../../../src/data/scenarios';
import { deleteMessage, loginAndOpenRoom } from '../../../src/steps';
import { validateMessageDeleted } from '../../../src/validations';

describe('Delete message', () => {
  it('should remove the message from the room and from the server', async () => {
    const { user, channel } = await scenario.userInChannel();
    const message = await scenario.messageFrom(user, channel);

    await loginAndOpenRoom(user, channel);
    await deleteMessage(message.msg);

    await validateMessageDeleted(message);
  });
});
