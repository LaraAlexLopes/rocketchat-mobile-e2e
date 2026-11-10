import fs from 'node:fs/promises';
import path from 'node:path';

import { logger } from './logger';

const ATTRIBUTE = (name: string) => new RegExp(`${name}="([^"]*)"`);

/** One line per node that has something useful to select by: id, accessibility label or text. */
const summarise = (pageSource: string): string[] =>
  pageSource
    .split(/<(?=[a-zA-Z])/)
    .map(node => {
      const id = node.match(ATTRIBUTE('resource-id'))?.[1];
      const desc = node.match(ATTRIBUTE('content-desc'))?.[1];
      const text = node.match(ATTRIBUTE('text'))?.[1];
      const parts = [id && `id=${id}`, desc && `desc=${desc}`, text && `text=${text}`].filter(Boolean);
      return parts.join(' | ');
    })
    .filter(Boolean);

/**
 * Saves the full UI hierarchy to logs/ and prints a compact summary,
 * so a failure in CI shows what was actually on screen.
 */
export const dumpScreen = async (testTitle: string): Promise<void> => {
  try {
    const source = await driver.getPageSource();
    const file = path.resolve('logs', `screen-${testTitle.replace(/[^a-z0-9]+/gi, '-').slice(0, 80)}.xml`);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, source);

    const activity = await driver.getCurrentActivity().catch(() => 'unknown');
    const lines = summarise(source);
    logger.info(`screen at failure (activity ${activity}, ${lines.length} nodes, full tree: ${file}):`);
    for (const line of lines.slice(0, 80)) logger.info(`  ${line}`);
  } catch (error) {
    logger.warn(`could not dump the screen: ${(error as Error).message}`);
  }
};
