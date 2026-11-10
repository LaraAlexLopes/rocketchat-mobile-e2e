import { TIMEOUTS } from '../config/timeouts';
import { device } from '../utils/device';
import { byTestId } from '../utils/selectors';

export abstract class BaseScreen {
  protected constructor(private readonly rootTestId: string) {}

  get rootSelector(): string {
    return byTestId(this.rootTestId);
  }

  get root() {
    return $(this.rootSelector);
  }

  async waitForDisplayed(timeout: number = TIMEOUTS.long): Promise<void> {
    await device.waitForAppElement(byTestId(this.rootTestId), this.constructor.name, timeout);
  }

  protected async fill(selector: string, value: string): Promise<void> {
    await device.waitForAppElement(selector, selector, TIMEOUTS.medium);
    const field = $(selector);
    await field.click();
    await field.setValue(value);
  }

  protected async tap(selector: string): Promise<void> {
    await device.waitForAppElement(selector, selector, TIMEOUTS.medium);
    await $(selector).click();
  }
}
