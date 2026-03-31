import Handlebars from 'handlebars';
import { Disposable } from 'vscode';

import { ConfigService } from './config';
import { getLogger, ScopedLogger } from './logger';
import {
  RecoveryCommandResult,
  TabRecoveryMapping
} from '../types/config';
import { TabInfo, TabInfoBase } from '../types/tabs';
import { CompiledArgTemplate, CompiledMapping, CompiledMatchField } from '../types/tab-recovery';

export class TabRecoveryService implements Disposable {
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
            nextTickDelay: 0
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
          nextTickDelay: entry.nextTickDelay ?? 0
        });
      } catch {
        this._log.warn(`skipping invalid recovery mapping "${key}": compilation failed`);
      }
    }

    return result;
  }

  private _compileArg(arg: unknown): CompiledArgTemplate {
    if (typeof arg !== 'string') {
      throw new Error(`invalid recovery mapping argument: expected string, got ${typeof arg}`);
    }

    if (!arg.includes('{{')) {
      return { type: 'literal', value: arg };
    }

    return { type: 'template', render: Handlebars.compile(arg, { noEscape: true }) };
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
        nextTickDelay: mapping.nextTickDelay
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
      case 'template':
        return template.render(tabInfo);
    }
  }

  dispose(): void {
    this._disposables.forEach(d => d.dispose());
    this._compiled = null;
  }
}
