import { Disposable } from 'vscode';

import { MessageHandler } from '../handlers/message';
import { WebviewHandler } from '../handlers/webview';
import { ITabManagerService } from '../types/tab-manager';

export class WebviewMediator implements Disposable {
  private _tabManager: ITabManagerService;
  private _messageHandler: MessageHandler;
  private _webview: WebviewHandler;

  private _onMessageListener?: Disposable;
  private _onDidSyncTabsListener?: Disposable;
  private _onDidNotifyListener?: Disposable;

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

    this._onMessageListener = this._webview.onMessage(async (data) => {
      await this._messageHandler.handle(data);
    });

    this._onDidSyncTabsListener = this._tabManager.onDidSyncTabs(
      async (payload) => {
        await this._webview.sendSync(payload);
      }
    );

    this._onDidNotifyListener = this._tabManager.onDidNotify(
      async (payload) => {
        await this._webview.sendNotification(payload);
      }
    );
  }

  dispose() {
    this._onMessageListener?.dispose();
    this._onDidSyncTabsListener?.dispose();
    this._onDidNotifyListener?.dispose();
    this._webview.dispose();
    this._messageHandler.dispose();

    this._webview = null;
    this._messageHandler = null;
    this._tabManager = null;
  }
}
