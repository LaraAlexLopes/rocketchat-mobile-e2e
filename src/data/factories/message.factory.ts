import { faker } from '@faker-js/faker';

const suffix = () => faker.string.alphanumeric(6).toLowerCase();

export const buildMessage = (): string => `${faker.word.words(3).replace(/[^a-zA-Z ]/g, '')} ${suffix()}`;

export const buildAccentedMessage = (): string => `Ação rápida com café e açúcar ${suffix()}`;
