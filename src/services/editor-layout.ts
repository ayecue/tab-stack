import { Disposable, Event, EventEmitter } from 'vscode';

import { Layout } from '../types/commands';
import { getEditorLayout } from '../utils/commands';
import { isLayoutEqual } from '../utils/is-layout-equal';

export class EditorLayoutService implements Disposable {
  static readonly DEFAULT_POLL_INTERVAL = 1000;

  private _pollInterval: number;
  private _emitter: EventEmitter<Layout>;

  private _lastLayout: Layout | null;
  private _timer: NodeJS.Timeout | null;
  private _active: boolean;

  constructor(
    pollInterval: number = EditorLayoutService.DEFAULT_POLL_INTERVAL
  ) {
    this._pollInterval = pollInterval;
    this._emitter = new EventEmitter<Layout>();
    this._lastLayout = null;
    this._timer = null;
    this._active = false;
  }

  get onDidChangeLayout(): Event<Layout> {
    return this._emitter.event;
  }

  setLayout(layout: Layout): void {
    this._lastLayout = layout;
  }

  start() {
    if (this._active) {
      return;
    }

    this._active = true;
    this._timer = setTimeout(this.next.bind(this), this._pollInterval);
  }

  private async next() {
    if (!this._active) {
      return;
    }

    await this.evaluate();
    this._timer = setTimeout(this.next.bind(this), this._pollInterval);
  }

  private async evaluate(): Promise<void> {
    try {
      const layout = await getEditorLayout();

      if (!this._lastLayout) {
        this._lastLayout = layout;
        return;
      }

      if (!isLayoutEqual(this._lastLayout, layout)) {
        this._lastLayout = layout;
        this._emitter.fire(layout);
      }
    } catch (error) {
      console.warn('Failed to check editor layout', error);
    }
  }

  dispose() {
    this._active = false;

    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }

    if (this._emitter) {
      this._emitter.dispose();
      this._emitter = null;
    }

    this._lastLayout = null;
  }
}
