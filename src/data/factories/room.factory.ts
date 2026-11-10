import { faker } from '@faker-js/faker';

import { runPrefix, slug } from '../naming';

export const buildRoomName = (): string => `${runPrefix()}${slug(faker.word.noun())}${faker.string.numeric(4)}`;
