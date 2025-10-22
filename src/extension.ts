import { ExtensionContext, window } from 'vscode';

import { createCommands } from './create-commands';
import { ViewManagerProvider } from './providers/view-manager';
import { EditorLayoutService } from './services/editor-layout';
import { TabManagerService } from './services/tab-manager';
import { TabStateService } from './services/tab-state';
import { getEditorLayout } from './utils/commands';

export async function activate(context: ExtensionContext) {
  const layoutService = new EditorLayoutService();
  const stateService = new TabStateService();

  await stateService.initialize();
  layoutService.setLayout(await getEditorLayout());
  layoutService.start();

  const tabManagerService = new TabManagerService(stateService, layoutService);
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
    tabManagerService,
    viewManagerProvider,
    ...createCommands(tabManagerService)
  );
}

export function deactivate() {}
