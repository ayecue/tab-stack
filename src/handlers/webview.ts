import debounce from 'debounce';
import {
  Disposable,
  EventEmitter,
  ExtensionContext,
  Uri,
  WebviewView,
  workspace
} from 'vscode';

import {
  ExtensionMessageType,
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from '../types/messages';

export class WebviewHandler implements Disposable {
  static readonly DEBOUNCE_DELAY = 10 as const;

  sendSync: (payload: Omit<ExtensionTabsSyncMessage, 'type'>) => Promise<void>;

  private _view: WebviewView;
  private _context: ExtensionContext;
  private _messageEmitter: EventEmitter<any>;

  constructor(view: WebviewView, context: ExtensionContext) {
    this._view = view;
    this._context = context;
    this._messageEmitter = new EventEmitter<any>();
    this.sendSync = debounce(
      this._sendSync.bind(this),
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
    this._view.webview.onDidReceiveMessage((data) =>
      this._messageEmitter.fire(data)
    );
  }

  private async _getHtmlForWebview() {
    const htmlUri = Uri.joinPath(this._context.extensionUri, 'webview.html');
    const cssUri = Uri.joinPath(this._context.extensionUri, 'webview.css');
    const jsUri = Uri.joinPath(this._context.extensionUri, 'webview.js');

    const cssWebviewUri = this._view.webview.asWebviewUri(cssUri);
    const jsWebviewUri = this._view.webview.asWebviewUri(jsUri);

    const htmlData = await workspace.fs.readFile(htmlUri);
    let html = new TextDecoder().decode(htmlData);

    html = html.replace('{{CSS_URI}}', cssWebviewUri.toString());
    html = html.replace('{{JS_URI}}', jsWebviewUri.toString());

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

  private _sendSync(payload: Omit<ExtensionTabsSyncMessage, 'type'>) {
    if (!this._view) {
      return;
    }

    this._view.webview.postMessage({
      type: ExtensionMessageType.Sync,
      ...payload
    } satisfies ExtensionTabsSyncMessage);
  }

  dispose() {
    this._messageEmitter.dispose();

    this._messageEmitter = null;
    this._context = null;
    this._view = null;
  }
}
