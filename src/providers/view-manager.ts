import {
  CancellationToken,
  ExtensionContext,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext
} from 'vscode';

import { MessageHandler } from '../handlers/message';
import { WebviewHandler } from '../handlers/webview';
import { WebviewMediator } from '../mediators/webview';
import { ITabManagerService } from '../types/tab-manager';

export class ViewManagerProvider implements WebviewViewProvider {
  static readonly VIEW_TYPE = 'tabStackView' as const;
  // Test bridge: keep a reference to the latest message handler for integration tests
  static __test__messageHandler: MessageHandler | null = null;

  private _context: ExtensionContext;
  private _tabManager: ITabManagerService;

  constructor(context: ExtensionContext, tabManager: ITabManagerService) {
    this._context = context;
    this._tabManager = tabManager;
  }

  async resolveWebviewView(
    webviewView: WebviewView,
    _context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    const viewHandler = new WebviewHandler(webviewView, this._context);
    const messageHandler = new MessageHandler(this._tabManager);
    const mediator = new WebviewMediator(
      this._tabManager,
      messageHandler,
      viewHandler
    );

    await mediator.initialize();

    // Expose the handler for tests (non-production usage)
    ViewManagerProvider.__test__messageHandler = messageHandler;

    this._context.subscriptions.push(mediator);
  }

  // For integration tests: simulate a message posted from the webview
  static async __test__dispatchFromWebview(data: any): Promise<void> {
    if (!ViewManagerProvider.__test__messageHandler) {
      throw new Error('Webview not initialized - open the view first');
    }
    await ViewManagerProvider.__test__messageHandler.handle(data);
  }

  dispose() {
    this._tabManager = null;
    this._context = null;
  }
}
