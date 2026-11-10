import { buildAccentedMessage, buildMessage } from '../../../src/data/factories/message.factory';
import { scenario } from '../../../src/data/scenarios';
import { loginAndOpenRoom, sendMessage } from '../../../src/steps';
import { validateMessageSent } from '../../../src/validations';

const cases = [
  { content: 'plain text', tags: ' @smoke', build: buildMessage },
  { content: 'accented characters', tags: '', build: buildAccentedMessage },
];

describe('Send message', () => {
  for (const { content, tags, build } of cases) {
    it(`should show a message with ${content} in the room and persist it on the server${tags}`, async () => {
      const { user, channel } = await scenario.userInChannel();
      const text = build();

      await loginAndOpenRoom(user, channel);
      await sendMessage(text);

      await validateMessageSent(channel, text, user);
    });
  }
});
