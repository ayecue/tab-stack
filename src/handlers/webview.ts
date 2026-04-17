import debounce from 'debounce';
import { nanoid } from 'nanoid';
import {
  Disposable,
  EventEmitter,
  ExtensionContext,
  Uri,
  WebviewView,
  workspace
} from 'vscode';

import {
  ExtensionCollectionsSyncMessage,
  ExtensionConfigSyncMessage,
  ExtensionMessageType,
  ExtensionNotificationMessage,
  ExtensionTabStateSyncMessage
} from '../types/messages';

export class WebviewHandler implements Disposable {
  static readonly DEBOUNCE_DELAY = 10 as const;

  sendTabStateSync: (
    payload: Omit<ExtensionTabStateSyncMessage, 'type'>
  ) => void;

  sendCollectionsSync: (
    payload: Omit<ExtensionCollectionsSyncMessage, 'type'>
  ) => void;

  sendConfigSync: (payload: Omit<ExtensionConfigSyncMessage, 'type'>) => void;

  private _view: WebviewView;
  private _context: ExtensionContext;
  private _messageEmitter: EventEmitter<any>;

  private _messageListener: Disposable | null = null;

  constructor(view: WebviewView, context: ExtensionContext) {
    this._view = view;
    this._context = context;
    this._messageEmitter = new EventEmitter<any>();
    this.sendTabStateSync = debounce(
      this._sendTabStateSync.bind(this),
      WebviewHandler.DEBOUNCE_DELAY
    );
    this.sendCollectionsSync = debounce(
      this._sendCollectionsSync.bind(this),
      WebviewHandler.DEBOUNCE_DELAY
    );
    this.sendConfigSync = debounce(
      this._sendConfigSync.bind(this),
      WebviewHandler.DEBOUNCE_DELAY
    );
  }

  get view() {
    return this._view;
  }

  get onMessage() {
    return this._messageEmitter.event;
  }

  async initialize() {
    this._view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._context.extensionUri,
        Uri.joinPath(this._context.extensionUri, 'src', 'webview'),
        Uri.joinPath(this._context.extensionUri, 'out', 'webview')
      ]
    };

    this._view.webview.html = await this._getHtmlForWebview();
    this._messageListener = this._view.webview.onDidReceiveMessage((data) => {
      this._messageEmitter.fire(data);
    });
  }

  private async _getHtmlForWebview() {
    const htmlUri = Uri.joinPath(this._context.extensionUri, 'webview.html');
    const cssUri = Uri.joinPath(this._context.extensionUri, 'webview.css');
    const jsUri = Uri.joinPath(this._context.extensionUri, 'webview.js');

    const cssWebviewUri = this._view.webview.asWebviewUri(cssUri);
    const jsWebviewUri = this._view.webview.asWebviewUri(jsUri);
    const cspSource = this._view.webview.cspSource;
    const nonce = nanoid();

    const htmlData = await workspace.fs.readFile(htmlUri);
    let html = new TextDecoder().decode(htmlData);

    html = html.replace('{{CSS_URI}}', cssWebviewUri.toString());
    html = html.replace('{{JS_URI}}', jsWebviewUri.toString());
    html = html.replaceAll('{{CSP_SOURCE}}', cspSource);
    html = html.replaceAll('{{NONCE}}', nonce);

    return html;
  }

  sendNotification(payload: Omit<ExtensionNotificationMessage, 'type'>) {
    if (!this._view) {
      return;
    }

    this._view.webview.postMessage({
      type: ExtensionMessageType.Notification,
      ...payload
    } satisfies ExtensionNotificationMessage);
  }

  private _sendTabStateSync(
    payload: Omit<ExtensionTabStateSyncMessage, 'type'>
  ) {
    if (!this._view) {
      return;
    }

    this._view.webview.postMessage({
      type: ExtensionMessageType.TabStateSync,
      ...payload
    } satisfies ExtensionTabStateSyncMessage);
  }

  private _sendCollectionsSync(
    payload: Omit<ExtensionCollectionsSyncMessage, 'type'>
  ) {
    if (!this._view) {
      return;
    }

    this._view.webview.postMessage({
      type: ExtensionMessageType.CollectionsSync,
      ...payload
    } satisfies ExtensionCollectionsSyncMessage);
  }

  private _sendConfigSync(payload: Omit<ExtensionConfigSyncMessage, 'type'>) {
    if (!this._view) {
      return;
    }

    this._view.webview.postMessage({
      type: ExtensionMessageType.ConfigSync,
      ...payload
    } satisfies ExtensionConfigSyncMessage);
  }

  dispose() {
    this._messageEmitter.dispose();
    this._messageListener?.dispose();

    this._messageListener = null;
    this._messageEmitter = null;
    this._context = null;
    this._view = null;
  }
}
