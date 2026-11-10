import { scenario } from '../../../src/data/scenarios';
import { loginAndOpenRoom } from '../../../src/steps';
import { validateMessageDisplayed } from '../../../src/validations';

describe('Receive message', () => {
  it('should display, in real time, a message another user sends to the room', async () => {
    const { user: reader, other: sender, channel } = await scenario.twoUsersInChannel();

    await loginAndOpenRoom(reader, channel);
    const message = await scenario.messageFrom(sender, channel);

    await validateMessageDisplayed(message.msg);
  });
});
