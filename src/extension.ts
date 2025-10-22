import { ExtensionContext, window } from 'vscode';

import { createCommands } from './create-commands';
import { ViewManagerProvider } from './providers/view-manager';
import { ConfigService } from './services/config';
import { EditorLayoutService } from './services/editor-layout';
import { GitService } from './services/git';
import { TabManagerService } from './services/tab-manager';
import { TabStateService } from './services/tab-state';
import { getEditorLayout } from './utils/commands';

export async function activate(context: ExtensionContext) {
  const layoutService = new EditorLayoutService();
  const configService = new ConfigService();
  const stateService = new TabStateService(configService);

  // Initialize git service with config service
  const gitService = new GitService(configService);
  const gitInitialized = await gitService.initialize();

  if (!gitInitialized) {
    console.warn(
      'Git service failed to initialize - git integration will be disabled'
    );
  }

  await stateService.initialize();
  layoutService.setLayout(await getEditorLayout());
  layoutService.start();

  const tabManagerService = new TabManagerService(
    stateService,
    layoutService,
    configService,
    gitInitialized ? gitService : null
  );
  const viewManagerProvider = new ViewManagerProvider(
    context,
    tabManagerService
  );

  context.subscriptions.push(
    window.registerWebviewViewProvider(
      ViewManagerProvider.VIEW_TYPE,
      viewManagerProvider
    )
  );

  context.subscriptions.push(
    stateService,
    layoutService,
    configService,
    tabManagerService,
    viewManagerProvider,
    ...createCommands(tabManagerService)
  );

  if (gitInitialized) {
    context.subscriptions.push(gitService);
  }
}

export function deactivate() {}
