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

    this._context.subscriptions.push(mediator);
  }

  dispose() {
    this._tabManager = null;
    this._context = null;
  }
}
