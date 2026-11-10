import { TIMEOUTS } from '../config/timeouts';
import { device } from '../utils/device';
import { byTestId } from '../utils/selectors';

/** A screen is identified by the test id of its root view. */
export abstract class BaseScreen {
  protected constructor(private readonly rootTestId: string) {}

  get root() {
    return $(byTestId(this.rootTestId));
  }

  /** Waits for the screen, dismissing system dialogs (permissions, autofill) that may cover it. */
  async waitForDisplayed(timeout: number = TIMEOUTS.long): Promise<void> {
    await device.waitForAppElement(byTestId(this.rootTestId), this.constructor.name, timeout);
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
