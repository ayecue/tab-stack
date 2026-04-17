export interface CompiledMatchField {
  field: string;
  regex: RegExp;
}

export interface CompiledMapping {
  labelRegex: RegExp;
  matchFields: CompiledMatchField[];
  command: string;
  argTemplates: CompiledArgTemplate[];
  nextTickDelay: number;
  unique: boolean;
}

export type CompiledArgTemplate =
  | { type: 'literal'; value: unknown }
  | { type: 'template'; render: Handlebars.TemplateDelegate }
  | { type: 'object'; entries: [string, CompiledArgTemplate][] };
