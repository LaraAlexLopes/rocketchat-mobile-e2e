/**
 * Deletes every user and room created by the suite (any run), by prefix.
 * Usage: npm run data:sweep
 */
import { globalPrefix } from '../src/data/naming';
import { sweep } from '../src/data/sweeper';

await sweep(globalPrefix());
