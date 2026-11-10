import { env } from '../config/env';

export const runId = (): string => {
  process.env.TEST_RUN_ID ??= Date.now().toString(36);
  return process.env.TEST_RUN_ID;
};

export const globalPrefix = (): string => `${env.dataPrefix}_`;

export const runPrefix = (): string => `${globalPrefix()}${runId()}_`;

export const slug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
