import { faker } from '@faker-js/faker';

import type { NewUser } from '../../api';
import { runPrefix, slug } from '../naming';

export const buildUser = (overrides: Partial<NewUser> = {}): NewUser => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = `${runPrefix()}${slug(firstName)}${faker.string.numeric(4)}`;

  return {
    username,
    name: `${firstName} ${lastName}`,
    email: `${username}@example.com`,
    password: `Qa!${faker.string.alphanumeric(10)}`,
    ...overrides,
  };
};
