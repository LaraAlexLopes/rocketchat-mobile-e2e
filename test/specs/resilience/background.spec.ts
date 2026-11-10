import { buildMessage } from '../../../src/data/factories/message.factory';
import { scenario } from '../../../src/data/scenarios';
import { loginAndOpenRoom, sendAppToBackground, sendMessage } from '../../../src/steps';
import { validateMessageDisplayed, validateRoomOpen } from '../../../src/validations';

describe('App lifecycle', () => {
  it('should keep the open conversation after going to background and back', async () => {
    const { user, channel } = await scenario.userInChannel();
    const text = buildMessage();

    await loginAndOpenRoom(user, channel);
    await sendMessage(text);
    await validateMessageDisplayed(text);
    await sendAppToBackground();

    await validateRoomOpen(channel);
    await validateMessageDisplayed(text);
  });
});
