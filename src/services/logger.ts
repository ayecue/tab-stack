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
      const details = formatEventPayload(payload);
      log.debug(`event: ${type}${details}`);
    }
  });
}

function formatEventPayload(payload: Record<string, unknown>): string {
  const keys = Object.keys(payload);
  if (keys.length === 0) return '';

  const parts: string[] = [];

  if ('payload' in payload) {
    const p = payload.payload;
    if (typeof p === 'string') {
      parts.push(`id=${p}`);
    } else if (p && typeof p === 'object' && 'id' in p) {
      const obj = p as Record<string, unknown>;
      parts.push(`id=${obj.id}`);
      if ('label' in obj) parts.push(`label="${obj.label}"`);
      if ('name' in obj) parts.push(`name="${obj.name}"`);
    }
  }

  if ('stateContainer' in payload) {
    const sc = payload.stateContainer as Record<string, unknown>;
    if (sc?.id) parts.push(`id=${sc.id}`);
    if (sc?.name) parts.push(`name="${sc.name}"`);
  }

  if ('groupId' in payload) parts.push(`groupId=${payload.groupId}`);
  if ('addonId' in payload) parts.push(`addonId=${payload.addonId}`);
  if ('historyId' in payload) parts.push(`historyId=${payload.historyId}`);
  if ('newName' in payload) parts.push(`newName="${payload.newName}"`);
  if ('slot' in payload) parts.push(`slot=${payload.slot}`);
  if ('maxEntries' in payload) parts.push(`maxEntries=${payload.maxEntries}`);

  if ('tabs' in payload) {
    const tabs = payload.tabs;
    if (tabs && typeof tabs === 'object') {
      parts.push(`tabs=${Object.keys(tabs).length}`);
    }
  }

  return parts.length > 0 ? ` (${parts.join(', ')})` : '';
}
