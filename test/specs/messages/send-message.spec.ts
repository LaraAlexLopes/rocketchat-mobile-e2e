import { asAdmin } from '../../../src/api';
import { TIMEOUTS } from '../../../src/config/timeouts';
import { buildAccentedMessage, buildMessage } from '../../../src/data/factories/message.factory';
import { testData } from '../../../src/data/test-data';
import { roomFlow } from '../../../src/flows/room.flow';
import { roomScreen } from '../../../src/screens/room.screen';
import { eventually } from '../../../src/utils/eventually';

const cases = [
  { content: 'plain text', tags: ' @smoke', build: buildMessage },
  { content: 'accented characters', tags: '', build: buildAccentedMessage },
];

describe('Send message', () => {
  for (const { content, tags, build } of cases) {
    it(`should show a message with ${content} in the room and persist it on the server${tags}`, async () => {
      const author = await testData.user();
      const channel = await testData.publicChannel([author]);
      const text = build();

      await roomFlow.loginAndOpenRoom(author.credentials, channel.name);
      await roomScreen.sendMessage(text);

      await expect(roomScreen.message(text)).toBeDisplayed({ wait: TIMEOUTS.medium });
      await expect(roomScreen.messageError(text)).not.toBeDisplayed();

      const admin = await asAdmin();
      const stored = await eventually(() => admin.messages.findByText(channel, text), {
        message: `message "${text}" was not stored on the server`,
      });
      expect(stored.u.username).toBe(author.username);
    });
  }
});
