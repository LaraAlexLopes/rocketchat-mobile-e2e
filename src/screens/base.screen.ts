import { TIMEOUTS } from '../config/timeouts';
import { byTestId } from '../utils/selectors';

/** A screen is identified by the test id of its root view. */
export abstract class BaseScreen {
  protected constructor(private readonly rootTestId: string) {}

  get root() {
    return $(byTestId(this.rootTestId));
  }

  async waitForDisplayed(timeout: number = TIMEOUTS.long): Promise<void> {
    await this.root.waitForDisplayed({ timeout, timeoutMsg: `${this.constructor.name} was not displayed` });
  }

  protected async fill(selector: string, value: string): Promise<void> {
    const field = $(selector);
    await field.waitForDisplayed({ timeout: TIMEOUTS.medium });
    await field.click();
    await field.setValue(value);
  }

  protected async tap(selector: string): Promise<void> {
    const element = $(selector);
    await element.waitForDisplayed({ timeout: TIMEOUTS.medium });
    await element.click();
  }
}
