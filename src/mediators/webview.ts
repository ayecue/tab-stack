import { Disposable } from 'vscode';

import { MessageHandler } from '../handlers/message';
import { WebviewHandler } from '../handlers/webview';
import { ITabManagerService } from '../types/tab-manager';

export class WebviewMediator implements Disposable {
  private _tabManager: ITabManagerService;
  private _messageHandler: MessageHandler;
  private _webview: WebviewHandler;

  private _onMessageListener?: Disposable;
  private _onDidSyncTabStateListener?: Disposable;
  private _onDidSyncCollectionsListener?: Disposable;
  private _onDidSyncConfigListener?: Disposable;
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

    this._onDidSyncTabStateListener = this._tabManager.onDidSyncTabState(
      (payload) => {
        this._webview.sendTabStateSync(payload);
      }
    );

    this._onDidSyncCollectionsListener = this._tabManager.onDidSyncCollections(
      (payload) => {
        this._webview.sendCollectionsSync(payload);
      }
    );

    this._onDidSyncConfigListener = this._tabManager.onDidSyncConfig(
      (payload) => {
        this._webview.sendConfigSync(payload);
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
    this._onDidSyncTabStateListener?.dispose();
    this._onDidSyncCollectionsListener?.dispose();
    this._onDidSyncConfigListener?.dispose();
    this._onDidNotifyListener?.dispose();
    this._webview.dispose();
    this._messageHandler.dispose();

    this._webview = null;
    this._messageHandler = null;
    this._tabManager = null;
  }
}
