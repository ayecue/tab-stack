import { Tab, TabInputText, Uri, window, commands, TabInputTextDiff, TabInputCustom, TabInputNotebook, TabInputNotebookDiff, TabInputWebview, TabInputTerminal, TerminalLocation } from "vscode";
import { AssociatedTabInstance, TabInfoBase, TabInfoCustom, TabInfoMetaNotebookEditor, TabInfoMetaTerminal, TabInfoMetaTextEditor, TabInfoNotebook, TabInfoNotebookDiff, TabInfoTerminal, TabInfoText, TabInfoTextDiff, TabKind } from "../types/tabs";
import { focusGroup } from "../utils/commands";
import { getLogger, ScopedLogger } from "../services/logger";
import { delayNextTick } from "../utils/delay";

export abstract class TabCreationTask {
  abstract getDescription(): string;
  abstract findRelatedTab(openedTabs: readonly Tab[]): Tab | null;
  abstract addEditorListener(callback: (handle: AssociatedTabInstance) => void): { dispose: () => void };
  abstract executeCommand(): Promise<void>;
  findExistingTab(allTabs: readonly Tab[]): Tab | null {
    return null;
  }
  getMaxRuntime(): number {
    return 1000; // Default max runtime of 1 second, should be always greater than next tick delay
  }
  getNextTickDelay(): number {
    return 0;
  }
}

export class TabCreationTaskTabInputText extends TabCreationTask {
  private _tabInfo: TabInfoText;

  constructor(tabInfo: TabInfoText) {
    super();
    this._tabInfo = tabInfo;
  }

  findExistingTab(allTabs: readonly Tab[]): Tab | null {
    return allTabs.find(it =>
      it.input instanceof TabInputText &&
      it.input.uri.toString() === this._tabInfo.uri &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  findRelatedTab(tabs: readonly Tab[]) {
    return tabs.find(it =>
      it.label === this._tabInfo.label &&
      it.input instanceof TabInputText &&
      it.input.uri.toString() === this._tabInfo.uri &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  addEditorListener(callback: (handle: AssociatedTabInstance) => void) {
    return window.onDidChangeActiveTextEditor((handle) => {
      if (handle == null) return;
      if (handle.document.uri.toString() !== this._tabInfo.uri) return;
      if (handle.viewColumn !== this._tabInfo.viewColumn) return;
      callback(handle);
    });
  }

  async executeCommand() {
    await commands.executeCommand('vscode.open', Uri.parse(this._tabInfo.uri), {
      viewColumn: this._tabInfo.viewColumn,
      preview: false,
      preserveFocus: false,
      selection: (this._tabInfo.meta as TabInfoMetaTextEditor).selection
    });
  }

  getDescription() {
    return `text tab "${this._tabInfo.label}" with uri "${this._tabInfo.uri}" in column ${this._tabInfo.viewColumn}`;
  }
}

export class TabCreationTaskTabInputTextDiff extends TabCreationTask {
  private _tabInfo: TabInfoTextDiff;

  constructor(tabInfo: TabInfoTextDiff) {
    super();
    this._tabInfo = tabInfo;
  }

  findExistingTab(allTabs: readonly Tab[]): Tab | null {
    return allTabs.find(it =>
      it.input instanceof TabInputTextDiff &&
      it.input.original.toString() === this._tabInfo.originalUri &&
      it.input.modified.toString() === this._tabInfo.modifiedUri &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  findRelatedTab(tabs: readonly Tab[]) {
    return tabs.find(it =>
      it.label === this._tabInfo.label &&
      it.input instanceof TabInputTextDiff &&
      it.input.original.toString() === this._tabInfo.originalUri &&
      it.input.modified.toString() === this._tabInfo.modifiedUri &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  addEditorListener(callback: (handle: AssociatedTabInstance) => void): { dispose: () => void; } {
    return window.onDidChangeActiveTextEditor((handle) => {
      if (handle == null) return;
      if (handle.document.uri.toString() !== this._tabInfo.modifiedUri) return;
      if (handle.viewColumn !== this._tabInfo.viewColumn) return;
      callback(handle);
    });
  }

  async executeCommand() {
    await commands.executeCommand('vscode.diff', Uri.parse(this._tabInfo.originalUri), Uri.parse(this._tabInfo.modifiedUri), this._tabInfo.label, {
      viewColumn: this._tabInfo.viewColumn,
      preview: false,
      preserveFocus: false,
      selection: (this._tabInfo.meta as TabInfoMetaTextEditor).selection
    });
  }

  getDescription() {
    return `diff tab "${this._tabInfo.label}" with original uri "${this._tabInfo.originalUri}" and modified uri "${this._tabInfo.modifiedUri}" in column ${this._tabInfo.viewColumn}`;
  }
}

export class TabCreationTaskTabInputCustom extends TabCreationTask {
  private _tabInfo: TabInfoCustom;

  constructor(tabInfo: TabInfoCustom) {
    super();
    this._tabInfo = tabInfo;
  }

  findRelatedTab(tabs: readonly Tab[]) {
    return tabs.find(it =>
      it.label === this._tabInfo.label &&
      it.input instanceof TabInputCustom &&
      it.input.uri.toString() === this._tabInfo.uri &&
      it.input.viewType === this._tabInfo.viewType &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  addEditorListener(_callback: (handle: AssociatedTabInstance) => void): { dispose: () => void; } {
    // Custom editors don't have a specific event we can listen to, so we return a no-op disposable.
    return { dispose: () => { } };
  }

  async executeCommand() {
    await commands.executeCommand('vscode.openWith', Uri.parse(this._tabInfo.uri), this._tabInfo.viewType, {
      viewColumn: this._tabInfo.viewColumn,
      preview: false,
      preserveFocus: false,
    });
  }

  getDescription() {
    return `custom tab "${this._tabInfo.label}" with uri "${this._tabInfo.uri}", viewType "${this._tabInfo.viewType}" in column ${this._tabInfo.viewColumn}`;
  }
}

export class TabCreationTaskTabInputNotebook extends TabCreationTask {
  private _tabInfo: TabInfoNotebook;

  constructor(tabInfo: TabInfoNotebook) {
    super();
    this._tabInfo = tabInfo;
  }

  findExistingTab(allTabs: readonly Tab[]): Tab | null {
    return allTabs.find(it =>
      it.input instanceof TabInputNotebook &&
      it.input.uri.toString() === this._tabInfo.uri &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  findRelatedTab(tabs: readonly Tab[]) {
    return tabs.find(it =>
      it.label === this._tabInfo.label &&
      it.input instanceof TabInputNotebook &&
      it.input.uri.toString() === this._tabInfo.uri &&
      it.input.notebookType === this._tabInfo.notebookType &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  addEditorListener(callback: (handle: AssociatedTabInstance) => void): { dispose: () => void; } {
    return window.onDidChangeActiveNotebookEditor((handle) => {
      if (handle == null) return;
      if (handle.notebook.uri.toString() !== this._tabInfo.uri) return;
      if (handle.viewColumn !== this._tabInfo.viewColumn) return;
      callback(handle);
    });
  }

  async executeCommand() {
    await commands.executeCommand('vscode.openWith', Uri.parse(this._tabInfo.uri), this._tabInfo.notebookType, {
      viewColumn: this._tabInfo.viewColumn,
      preview: false,
      preserveFocus: false,
      selection: (this._tabInfo.meta as TabInfoMetaNotebookEditor).selection
    });
  }

  getDescription() {
    return `notebook tab "${this._tabInfo.label}" with uri "${this._tabInfo.uri}", notebookType "${this._tabInfo.notebookType}" in column ${this._tabInfo.viewColumn}`;
  }
}

export class TabCreationTaskTabInputNotebookDiff extends TabCreationTask {
  private _tabInfo: TabInfoNotebookDiff;

  constructor(tabInfo: TabInfoNotebookDiff) {
    super();
    this._tabInfo = tabInfo;
  }

  findExistingTab(allTabs: readonly Tab[]): Tab | null {
    return allTabs.find(it =>
      it.input instanceof TabInputNotebookDiff &&
      it.input.original.toString() === this._tabInfo.originalUri &&
      it.input.modified.toString() === this._tabInfo.modifiedUri &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  findRelatedTab(tabs: readonly Tab[]) {
    return tabs.find(it =>
      it.label === this._tabInfo.label &&
      it.input instanceof TabInputNotebookDiff &&
      it.input.original.toString() === this._tabInfo.originalUri &&
      it.input.modified.toString() === this._tabInfo.modifiedUri &&
      it.input.notebookType === this._tabInfo.notebookType &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  addEditorListener(callback: (handle: AssociatedTabInstance) => void): { dispose: () => void; } {
    return window.onDidChangeActiveNotebookEditor((handle) => {
      if (handle == null) return;
      if (handle.notebook.uri.toString() !== this._tabInfo.modifiedUri) return;
      if (handle.viewColumn !== this._tabInfo.viewColumn) return;
      callback(handle);
    });
  }

  async executeCommand() {
    await commands.executeCommand('vscode.diff', Uri.parse(this._tabInfo.originalUri), Uri.parse(this._tabInfo.modifiedUri), this._tabInfo.label, {
      viewColumn: this._tabInfo.viewColumn,
      preview: false,
      preserveFocus: false,
      selection: (this._tabInfo.meta as TabInfoMetaNotebookEditor).selection
    });
  }

  getDescription() {
    return `notebook diff tab "${this._tabInfo.label}" with original uri "${this._tabInfo.originalUri}" and modified uri "${this._tabInfo.modifiedUri}", notebookType "${this._tabInfo.notebookType}" in column ${this._tabInfo.viewColumn}`;
  }
}

export class TabCreationTaskTabInputTerminal extends TabCreationTask {
  private _tabInfo: TabInfoTerminal;

  constructor(tabInfo: TabInfoTerminal) {
    super();
    this._tabInfo = tabInfo;
  }

  findRelatedTab(tabs: readonly Tab[]) {
    const meta = this._tabInfo.meta as TabInfoMetaTerminal;
    return tabs.find(it =>
      it.input instanceof TabInputTerminal &&
      it.group.viewColumn === this._tabInfo.viewColumn
    ) ?? null;
  }

  addEditorListener(callback: (handle: AssociatedTabInstance) => void) {
    return window.onDidOpenTerminal((terminal) => {
      const meta = this._tabInfo.meta as TabInfoMetaTerminal;
      if (terminal.name !== meta.terminalName) return;
      callback(terminal);
    });
  }

  async executeCommand() {
    const meta = this._tabInfo.meta as TabInfoMetaTerminal;
    window.createTerminal({
      name: meta.terminalName,
      shellPath: meta.shellPath,
      cwd: meta.cwd ? Uri.parse(meta.cwd) : undefined,
      isTransient: meta.isTransient,
      location: {
        viewColumn: this._tabInfo.viewColumn,
        preserveFocus: false
      }
    });
  }

  getMaxRuntime(): number {
    return 5000;
  }

  getDescription() {
    return `terminal tab "${(this._tabInfo.meta as TabInfoMetaTerminal).terminalName}" in column ${this._tabInfo.viewColumn}`;
  }
}

export class TabCreationTaskCustomCommand extends TabCreationTask {
  private _tabInfo: TabInfoBase;
  private _command: string;
  private _args: unknown[];
  private _nextTickDelay: number;
  private _log: ScopedLogger;

  constructor(tabInfo: TabInfoBase, command: string, args: unknown[] = [], nextTickDelay: number = 0) {
    super();
    this._tabInfo = tabInfo;
    this._command = command;
    this._args = args;
    this._nextTickDelay = nextTickDelay;
    this._log = getLogger().child('TabCreationTaskCustomCommand');
  }

  getNextTickDelay(): number {
    return this._nextTickDelay;
  }

  getMaxRuntime(): number {
    return this.getNextTickDelay() + 1000;
  }

  findRelatedTab(tabs: readonly Tab[]) {
    return tabs.find(it =>
      it.group.viewColumn === this._tabInfo.viewColumn &&
      (
        (it.input instanceof TabInputWebview && this._tabInfo.kind === TabKind.TabInputWebview) ||
        (it.input instanceof TabInputTerminal && this._tabInfo.kind === TabKind.TabInputTerminal) ||
        ((
          !(it.input instanceof TabInputText) &&
          !(it.input instanceof TabInputTextDiff) &&
          !(it.input instanceof TabInputCustom) &&
          !(it.input instanceof TabInputNotebook) &&
          !(it.input instanceof TabInputNotebookDiff) &&
          !(it.input instanceof TabInputWebview) &&
          !(it.input instanceof TabInputTerminal)
        ) && this._tabInfo.kind === TabKind.Unknown)
      )
    ) ?? null
  }

  addEditorListener(_callback: (handle: AssociatedTabInstance) => void): { dispose: () => void; } {
    // For unknown tab types, we don't have a specific event to listen to, so we return a no-op disposable.
    return { dispose: () => { } };
  }

  async executeCommand() {
    this._log.debug(`executing recovery command: "${this._command}" for tab "${this._tabInfo.label}"`);
    await focusGroup(this._tabInfo.viewColumn);
    await commands.executeCommand(this._command, ...this._args);
  }

  getDescription() {
    return `unknown tab "${this._tabInfo.label}" in column ${this._tabInfo.viewColumn} using recovery command "${this._command}"`;
  }
}
