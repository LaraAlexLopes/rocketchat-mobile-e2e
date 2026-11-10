import { TIMEOUTS } from '../config/timeouts';

export const expectNeverDisplayed = async (
  selector: string,
  duration: number = TIMEOUTS.short * 2,
  interval = 500,
): Promise<void> => {
  const deadline = Date.now() + duration;
  while (Date.now() < deadline) {
    if (await $(selector).isDisplayed()) {
      throw new Error(`${selector} was displayed, but it should not be`);
    }
    await driver.pause(interval);
  }
};
