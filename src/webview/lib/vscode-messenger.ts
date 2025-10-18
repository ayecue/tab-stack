import EventEmitter from 'events';

import {
  BaseExtensionMessage,
  BaseWebviewMessage,
  ExtensionMessageType
} from '../../types/messages';

declare global {
  interface Window {
    acquireVsCodeApi: () => {
      postMessage: (message: any) => void;
      getState: () => any;
      setState: (state: any) => void;
    };
  }
}

declare const acquireVsCodeApi: () => {
  postMessage: (message: any) => void;
  getState: () => any;
  setState: (state: any) => void;
};

const DEFAULT_CONFIG: Required<MessagingConfig> = {
  enableLogging: false
};

export interface BaseMessage {
  type: string;
  timestamp?: number;
}

export interface MessagingConfig {
  enableLogging?: boolean;
}

export class VSCodeMessenger extends EventEmitter {
  private vscode: ReturnType<typeof acquireVsCodeApi>;
  private config: Required<MessagingConfig>;
  private isConnected = false;

  constructor(config: MessagingConfig = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.vscode = window.acquireVsCodeApi();
    this.initialize();
  }

  private initialize(): void {
    window.addEventListener('message', this.handleMessage.bind(this));

    this.isConnected = true;
    this.log('VSCodeMessenger initialized');
  }

  private log(...args: any[]): void {
    if (this.config.enableLogging) {
      console.log('[VSCodeMessenger]', ...args);
    }
  }

  private handleMessage(event: MessageEvent<BaseExtensionMessage>): void {
    try {
      this.log('Received message:', event);

      switch (event.data.type) {
        case ExtensionMessageType.Sync:
        case ExtensionMessageType.Notification:
          this.emit(event.data.type, event.data);
          break;
        default:
          throw new Error(`Unknown message type: ${event.data.type}`);
      }
    } catch (error) {
      this.log('Error handling message:', error);
    }
  }

  sendMessage<T extends BaseWebviewMessage>(message: T): void {
    if (!this.isConnected) {
      this.log('Cannot send message - not connected');
      return;
    }

    this.log('Sending direct message:', message);
    this.vscode.postMessage(message);
  }

  isConnectedToExtension(): boolean {
    return this.isConnected;
  }

  getConfig(): Required<MessagingConfig> {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<MessagingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('Configuration updated:', this.config);
  }

  disconnect(): void {
    this.isConnected = false;

    this.log('VSCodeMessenger disconnected');
  }
}

let defaultMessenger: VSCodeMessenger | null = null;

export function getDefaultMessenger(config?: MessagingConfig): VSCodeMessenger {
  if (!defaultMessenger) {
    defaultMessenger = new VSCodeMessenger(config);
  }
  return defaultMessenger;
}

export function createMessenger(config?: MessagingConfig): VSCodeMessenger {
  return new VSCodeMessenger(config);
}
