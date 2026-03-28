import { Disposable, LogOutputChannel, window } from 'vscode';

import type { Store, StoreInspectionEvent } from '@xstate/store';

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Off = 'off'
}

let globalLogger: Logger | null = null;

export class Logger implements Disposable {
  private _channel: LogOutputChannel | null;

  constructor(noop?: boolean) {
    this._channel = noop
      ? null
      : window.createOutputChannel('Tab Stack', { log: true });
  }

  debug(message: string, ...args: unknown[]): void {
    this._channel?.debug(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this._channel?.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this._channel?.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this._channel?.error(message, ...args);
  }

  child(scope: string): ScopedLogger {
    return new ScopedLogger(this, scope);
  }

  dispose(): void {
    globalLogger = null;
    this._channel?.dispose();
  }
}

class NoopLogger extends Logger {
  constructor() {
    super(true);
  }
}

export class ScopedLogger {
  constructor(
    private _parent: Logger,
    private _scope: string
  ) {}

  debug(message: string, ...args: unknown[]): void {
    this._parent.debug(`[${this._scope}] ${message}`, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this._parent.info(`[${this._scope}] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this._parent.warn(`[${this._scope}] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this._parent.error(`[${this._scope}] ${message}`, ...args);
  }
}

export function initializeLogger(): Logger {
  globalLogger = new Logger();
  return globalLogger;
}

export function getLogger(): Logger {
  if (!globalLogger) {
    globalLogger = new NoopLogger();
  }
  return globalLogger;
}

export function inspectStore(
  store: Store<any, any, any>,
  log: ScopedLogger
): void {
  store.inspect((evt: StoreInspectionEvent) => {
    if (evt.type === '@xstate.event') {
      const { type, ...payload } = evt.event;
      const details = JSON.stringify(payload, null, 2);
      log.debug(`event: ${type}${details}`);
    }
  });
}
