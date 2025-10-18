import { Disposable } from 'vscode';

import { MessageHandler } from '../handlers/message';
import { WebviewHandler } from '../handlers/webview';
import { ITabManagerService } from '../types/tab-manager';

export class WebviewMediator implements Disposable {
  private _tabManager: ITabManagerService;
  private _messageHandler: MessageHandler;
  private _webview: WebviewHandler;

  constructor(
    tabManager: ITabManagerService,
    messageHandler: MessageHandler,
    webview: WebviewHandler
  ) {
    this._tabManager = tabManager;
    this._messageHandler = messageHandler;
    this._webview = webview;
  }

  async initialize() {
    await this._webview.initialize();
    this._webview.on('message', async (data) => {
      await this._messageHandler.handle(data);
    });

    this._tabManager.onDidSyncTabs(async (payload) => {
      await this._webview.sendSync(payload);
    });

    this._tabManager.onDidNotify(async (payload) => {
      await this._webview.sendNotification(payload);
    });
  }

  dispose() {
    this._webview.dispose();
    this._messageHandler.dispose();
    this._tabManager = null;
  }
}
