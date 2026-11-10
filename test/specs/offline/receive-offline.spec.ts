import { scenario } from '../../../src/data/scenarios';
import { goOffline, goOnline, loginAndOpenRoom } from '../../../src/steps';
import { validateMessageDisplayed, validateMessageNeverArrives } from '../../../src/validations';

describe('Offline receiving', () => {
  afterEach(goOnline);

  it('should show messages received while offline once the connection is back', async () => {
    const { user: reader, other: sender, channel } = await scenario.twoUsersInChannel();

    await loginAndOpenRoom(reader, channel);
    await goOffline();
    const first = await scenario.messageFrom(sender, channel);
    const second = await scenario.messageFrom(sender, channel);
    await validateMessageNeverArrives(first.msg);
    await goOnline();

    await validateMessageDisplayed(first.msg);
    await validateMessageDisplayed(second.msg);
  });
});
