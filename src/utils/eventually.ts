import { TIMEOUTS } from '../config/timeouts';

/**
 * Polls an async check until it returns a value (not undefined/false) or times out.
 * Used for backend assertions, since the server persists asynchronously from what the UI shows.
 */
export const eventually = async <T>(
  check: () => Promise<T | undefined | false>,
  { timeout = TIMEOUTS.medium, interval = 500, message = 'condition was not met' } = {},
): Promise<T> => {
  const deadline = Date.now() + timeout;
  for (;;) {
    const result = await check();
    if (result !== undefined && result !== false) return result;
    if (Date.now() > deadline) throw new Error(`Timed out after ${timeout}ms: ${message}`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
};
