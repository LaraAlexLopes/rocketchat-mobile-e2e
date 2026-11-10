import { env } from '../../../src/config/env';
import { scenario } from '../../../src/data/scenarios';
import { deleteMessage, loginAndOpenRoom, openMessageActions } from '../../../src/steps';
import { validateCannotDelete, validateMessageDeleted } from '../../../src/validations';

describe('Delete permissions', () => {
  it('should not offer a regular user the option to delete another user message', async () => {
    const { user: reader, other: author, channel } = await scenario.twoUsersInChannel();
    const message = await scenario.messageFrom(author, channel);

    await loginAndOpenRoom(reader, channel);
    await openMessageActions(message.msg);

    await validateCannotDelete(message);
  });

  it('should let an admin delete another user message', async () => {
    const { user: author, channel } = await scenario.userInChannel();
    const message = await scenario.messageFrom(author, channel);

    await loginAndOpenRoom(env.admin, channel);
    await deleteMessage(message.msg);

    await validateMessageDeleted(message);
  });
});
