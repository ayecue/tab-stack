import { Tab } from "vscode";
import { OpenTabResult } from "../types/tabs";
import { ScopedLogger } from "../services/logger";
import { moveTabToEnd } from "../utils/commands";
import { TabOperation } from "./tab-operation";

export class MoveTabToEndOperation extends TabOperation {
  private _tab: Tab;
  private _log: ScopedLogger;
  private _resolve: (result: OpenTabResult) => void;
  private _promise: Promise<OpenTabResult>;

  constructor(tab: Tab, log: ScopedLogger) {
    super();
    this._tab = tab;
    this._log = log;
    this._resolve = null!;
    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  async execute(): Promise<void> {
    const group = this._tab.group;
    const tabIndex = group.tabs.indexOf(this._tab);
    const lastIndex = group.tabs.length - 1;

    if (tabIndex >= 0 && tabIndex !== lastIndex) {
      this._log.debug(`moving tab "${this._tab.label}" from index ${tabIndex} to end in column ${group.viewColumn}`);
      await moveTabToEnd(group.viewColumn, tabIndex);
    }

    this._resolve({ success: true, handle: null, tab: this._tab });
  }

  getRelevantPromise(): Promise<OpenTabResult> {
    return this._promise;
  }

  getDescription(): string {
    return `move existing tab "${this._tab.label}" to end of column ${this._tab.group.viewColumn}`;
  }
}
