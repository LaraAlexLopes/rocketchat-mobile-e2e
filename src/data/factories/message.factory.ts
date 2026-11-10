import { faker } from '@faker-js/faker';

export const buildMessage = (): string =>
  `${faker.word.words(3).replace(/[^a-zA-Z ]/g, '')} ${faker.string.alphanumeric(6).toLowerCase()}`;
