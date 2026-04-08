import Handlebars from 'handlebars';
import { Disposable } from 'vscode';

import { ConfigService } from './config';
import { getLogger, ScopedLogger } from './logger';
import {
  RecoveryCommandResult,
  TabRecoveryMapping
} from '../types/config';
import type { TabRecoverabilityResolver } from '../types/tab-active-state';
import { TabInfo, TabInfoBase, TabKind } from '../types/tabs';
import { CompiledArgTemplate, CompiledMapping, CompiledMatchField } from '../types/tab-recovery';

export class TabRecoveryService
  implements Disposable, TabRecoverabilityResolver
{
  static readonly tabInfoFields: Set<keyof TabInfoBase> = new Set([
    'id',
    'label',
    'kind',
    'isActive',
    'isPinned',
    'isDirty',
    'index',
    'viewColumn',
    'isRecoverable'
  ]);

  private _configService: ConfigService;
  private _log: ScopedLogger;
  private _compiled: CompiledMapping[] | null = null;
  private _disposables: Disposable[] = [];

  constructor(configService: ConfigService) {
    this._configService = configService;
    this._log = getLogger().child('TabRecoveryResolver');

    this.attach();
  }

  private attach() {
    this._disposables.push(
      this._configService.onDidChangeConfig(() => this.invalidate())
    );
  }

  private invalidate(): void {
    this._compiled = null;
  }

  private _ensureCompiled(): CompiledMapping[] {
    if (this._compiled != null) return this._compiled;

    const raw = this._configService.getTabRecoveryMappings();
    this._compiled = this._compile(raw);
    return this._compiled;
  }

  private _compile(raw: TabRecoveryMapping): CompiledMapping[] {
    const result: CompiledMapping[] = [];

    for (const [key, entry] of Object.entries(raw)) {
      try {
        if (typeof entry === 'string') {
          result.push({
            labelRegex: new RegExp(key),
            matchFields: [],
            command: entry,
            argTemplates: [],
            nextTickDelay: 0,
            unique: false
          });
          continue;
        }

        const labelPattern = entry.match?.label ?? key;
        const labelRegex = new RegExp(labelPattern);

        const matchFields: CompiledMatchField[] = [];
        if (entry.match) {
          for (const [field, pattern] of Object.entries(entry.match)) {
            if (field === 'label') continue;
            matchFields.push({ field, regex: new RegExp(pattern as string) });
          }
        }

        const argTemplates = (entry.args ?? []).map(arg => this._compileArg(arg));

        result.push({
          labelRegex,
          matchFields,
          command: entry.command,
          argTemplates,
          nextTickDelay: entry.nextTickDelay ?? 0,
          unique: entry.unique ?? false
        });
      } catch {
        this._log.warn(`skipping invalid recovery mapping "${key}": compilation failed`);
      }
    }

    return result;
  }

  private _compileArg(arg: unknown): CompiledArgTemplate {
    if (arg == null || typeof arg === 'number' || typeof arg === 'boolean') {
      return { type: 'literal', value: arg };
    }

    if (typeof arg === 'string') {
      if (!arg.includes('{{')) {
        return { type: 'literal', value: arg };
      }
      return { type: 'template', render: Handlebars.compile(arg, { noEscape: true }) };
    }

    if (typeof arg === 'object' && !Array.isArray(arg)) {
      const entries: [string, CompiledArgTemplate][] = Object.entries(arg as Record<string, unknown>)
        .map(([key, val]) => [key, this._compileArg(val)] as [string, CompiledArgTemplate]);
      return { type: 'object', entries };
    }

    throw new Error(`invalid recovery mapping argument: unsupported type ${typeof arg}`);
  }

  findMatch(tabInfo: TabInfo): RecoveryCommandResult | null {
    const compiled = this._ensureCompiled();

    for (const mapping of compiled) {
      if (!mapping.labelRegex.test(tabInfo.label)) continue;
      if (!this._matchesFields(mapping.matchFields, tabInfo)) continue;

      const args = mapping.argTemplates.map(t => this._resolveArg(t, tabInfo));

      return {
        command: mapping.command,
        args,
        nextTickDelay: mapping.nextTickDelay,
        unique: mapping.unique
      };
    }

    return null;
  }

  hasMatch(tabInfo: TabInfo): boolean {
    const compiled = this._ensureCompiled();

    for (const mapping of compiled) {
      if (!mapping.labelRegex.test(tabInfo.label)) continue;
      if (!this._matchesFields(mapping.matchFields, tabInfo)) continue;
      return true;
    }

    return false;
  }

  isRecoverable(tabInfo: TabInfo): boolean {
    switch (tabInfo.kind) {
      case TabKind.TabInputText:
      case TabKind.TabInputTextDiff:
      case TabKind.TabInputNotebook:
      case TabKind.TabInputNotebookDiff:
      case TabKind.TabInputCustom:
      case TabKind.TabInputTerminal:
        return true;
      case TabKind.TabInputWebview:
      case TabKind.Unknown:
      default:
        return this.hasMatch(tabInfo);
    }
  }

  private _extractField(tabInfo: TabInfo, field: string): TabInfoBase[keyof Omit<TabInfoBase, 'meta'>] | null {
    if (!TabRecoveryService.tabInfoFields.has(field as keyof TabInfoBase)) {
      this._log.warn(`invalid match field "${field}" in recovery mapping: not a valid TabInfo property`);
      return null;
    }
    return tabInfo[field as keyof Omit<TabInfoBase, 'meta'>] ?? null;
  }

  private _matchesFields(fields: CompiledMatchField[], tabInfo: TabInfo): boolean {
    for (const { field, regex } of fields) {
      const value = this._extractField(tabInfo, field);
      if (value == null) return false;
      if (!regex.test(String(value))) return false;
    }
    return true;
  }

  private _resolveArg(template: CompiledArgTemplate, tabInfo: TabInfo): unknown {
    switch (template.type) {
      case 'literal':
        return template.value;
      case 'template': {
        const rendered = template.render(tabInfo);
        if (rendered === 'true') return true;
        if (rendered === 'false') return false;
        const num = Number(rendered);
        if (rendered !== '' && !Number.isNaN(num)) return num;
        return rendered;
      }
      case 'object': {
        const result: Record<string, unknown> = {};
        for (const [key, valTemplate] of template.entries) {
          result[key] = this._resolveArg(valTemplate, tabInfo);
        }
        return result;
      }
    }
  }

  dispose(): void {
    this._disposables.forEach(d => d.dispose());
    this._compiled = null;
  }
}
