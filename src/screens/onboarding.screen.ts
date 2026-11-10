import { byButtonText, byTestId } from '../utils/selectors';
import { BaseScreen } from './base.screen';

class OnboardingScreen extends BaseScreen {
  private readonly selectors = {
    serverInput: byTestId('new-server-view-input'),
    connectButton: byButtonText('Connect'),
  };

  constructor() {
    super('new-server-view');
  }

  async connectTo(serverUrl: string): Promise<void> {
    await this.fill(this.selectors.serverInput, serverUrl);
    await this.tap(this.selectors.connectButton);
  }
}

export const onboardingScreen = new OnboardingScreen();
