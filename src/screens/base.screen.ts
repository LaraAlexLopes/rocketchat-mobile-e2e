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

  // Every interaction waits through system dialogs: an ANR or permission prompt can pop up mid-flow.

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
