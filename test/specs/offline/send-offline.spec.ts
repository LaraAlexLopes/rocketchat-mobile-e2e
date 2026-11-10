import { buildMessage } from '../../../src/data/factories/message.factory';
import { scenario } from '../../../src/data/scenarios';
import { goOffline, goOnline, loginAndOpenRoom, sendMessage } from '../../../src/steps';
import { validateMessageNotDelivered } from '../../../src/validations';

describe('Offline messaging', () => {
  afterEach(goOnline);

  it('should flag a message sent without network as not delivered', async () => {
    const { user, channel } = await scenario.userInChannel();
    const text = buildMessage();

    await loginAndOpenRoom(user, channel);
    await goOffline();
    await sendMessage(text);

    await validateMessageNotDelivered(channel, text);
  });
});
