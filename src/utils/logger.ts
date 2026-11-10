const debugEnabled = process.env.DEBUG_E2E === 'true';

export const logger = {
  info: (message: string) => console.log(`[e2e] ${message}`),
  warn: (message: string) => console.warn(`[e2e] WARN ${message}`),
  debug: (message: string) => {
    if (debugEnabled) console.log(`[e2e] DEBUG ${message}`);
  },
};
