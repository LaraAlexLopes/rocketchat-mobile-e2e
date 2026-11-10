import { faker } from '@faker-js/faker';

/**
 * Plain words plus a unique suffix: readable in reports and unique on screen,
 * without characters that Rocket.Chat would turn into markdown, mentions or emojis.
 */
export const buildMessage = (): string =>
  `${faker.word.words(3).replace(/[^a-zA-Z ]/g, '')} ${faker.string.alphanumeric(6).toLowerCase()}`;
