import { byButtonText } from '../utils/selectors';
import { BaseScreen } from './base.screen';

/** Workspace landing screen, shown after connecting to a server. */
class WorkspaceScreen extends BaseScreen {
  private readonly selectors = {
    loginButton: byButtonText('Login'),
  };

  constructor() {
    super('workspace-view');
  }

  async openLogin(): Promise<void> {
    await this.tap(this.selectors.loginButton);
  }
}

export const workspaceScreen = new WorkspaceScreen();
