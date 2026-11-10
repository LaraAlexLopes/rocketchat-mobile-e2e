import { env } from '../config/env';

/**
 * Every record created by the suite is named `<prefix>_<runId>_...`.
 * The run id is generated once by the launcher (wdio.conf.ts) and inherited by every worker,
 * so one run can be told apart from another and leftovers can always be swept by prefix.
 */
export const runId = (): string => {
  process.env.TEST_RUN_ID ??= Date.now().toString(36);
  return process.env.TEST_RUN_ID;
};

/** Prefix shared by all data from every run (used by the sweeper). */
export const globalPrefix = (): string => `${env.dataPrefix}_`;

/** Prefix of the data created by the current run. */
export const runPrefix = (): string => `${globalPrefix()}${runId()}_`;

/** Lowercase alphanumeric slug, safe for Rocket.Chat usernames and room names. */
export const slug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
