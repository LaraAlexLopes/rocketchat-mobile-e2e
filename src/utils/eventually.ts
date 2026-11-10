import { TIMEOUTS } from '../config/timeouts';

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
