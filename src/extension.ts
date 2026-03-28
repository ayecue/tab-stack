import { ExtensionContext, window } from 'vscode';

import { createCommands } from './create-commands';
import { createUriHandler } from './create-uri-handler';
import { ViewManagerProvider } from './providers/view-manager';
import { ConfigService } from './services/config';
import { EditorLayoutService } from './services/editor-layout';
import { GitService } from './services/git';
import { initializeLogger } from './services/logger';
import { TabManagerService } from './services/tab-manager';
import { getEditorLayout } from './utils/commands';

export async function activate(context: ExtensionContext) {
  const logger = initializeLogger();
  context.subscriptions.push(logger);

  logger.info('Tab Stack activating');

  const layoutService = new EditorLayoutService();
  const configService = new ConfigService();

  // Initialize git service with config service
  const gitService = new GitService(configService);
  const gitInitialized = await gitService.initialize();

  if (!gitInitialized) {
    console.warn(
      'Git service failed to initialize - git integration will be disabled'
    );
  }

  layoutService.setLayout(await getEditorLayout());
  layoutService.start();

  const tabManagerService = new TabManagerService(
    context,
    layoutService,
    configService,
    gitService
  );

  await tabManagerService.attachStateHandler();

  const viewManagerProvider = new ViewManagerProvider(
    context,
    tabManagerService
  );

  context.subscriptions.push(
    window.registerWebviewViewProvider(
      ViewManagerProvider.VIEW_TYPE,
      viewManagerProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  );

  context.subscriptions.push(
    layoutService,
    configService,
    tabManagerService,
    viewManagerProvider,
    ...createCommands(tabManagerService),
    createUriHandler()
  );

  if (gitInitialized) {
    context.subscriptions.push(gitService);
  }
}

export function deactivate() {}
