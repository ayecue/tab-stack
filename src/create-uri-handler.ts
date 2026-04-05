import { commands, Disposable, Uri, window } from 'vscode';

import { EXTENSION_NAME } from './types/extension';

type UriRouteHandler = (params: URLSearchParams) => Promise<void>;

const MAX_NAME_LENGTH = 255;
const MAX_FILE_PATH_LENGTH = 1024;

function validateName(value: string | null): string | null {
  if (!value) return null;
  const sanitized = value.replace(/\0/g, '').trim();
  if (!sanitized || sanitized.length > MAX_NAME_LENGTH) return null;
  return sanitized;
}

function validateSlot(value: string | null): string | null {
  if (!value || !/^[1-9]$/.test(value)) return null;
  return value;
}

function validateFilePath(value: string | null): string | null {
  if (!value) return null;
  const sanitized = value.replace(/\0/g, '').trim();
  if (!sanitized || sanitized.length > MAX_FILE_PATH_LENGTH) return null;
  if (sanitized.includes('..')) return null;
  return sanitized;
}

const uriCommandMap: Record<string, UriRouteHandler> = {
  '/switch-group': async (params) => {
    const name = validateName(params.get('name'));
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.switchGroup`, name);
  },
  '/create-group': async (params) => {
    const name = validateName(params.get('name'));
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.createGroup`, name);
  },
  '/delete-group': async (params) => {
    const name = validateName(params.get('name'));
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.deleteGroup`, name);
  },
  '/snapshot': async () => {
    await commands.executeCommand(`${EXTENSION_NAME}.snapshot`);
  },
  '/restore-snapshot': async (params) => {
    const name = validateName(params.get('name'));
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.restoreSnapshot`, name);
  },
  '/apply-addon': async (params) => {
    const name = validateName(params.get('name'));
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.applyAddon`, name);
  },
  '/import-group': async (params) => {
    const file = validateFilePath(params.get('file'));
    if (file) await commands.executeCommand(`${EXTENSION_NAME}.importGroup`, file);
  },
  '/export-group': async (params) => {
    const name = validateName(params.get('name'));
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.exportGroup`, name);
  },
  '/quick-switch': async () => {
    await commands.executeCommand(`${EXTENSION_NAME}.quickSwitch`);
  },
  '/quick-slot': async (params) => {
    const slot = validateSlot(params.get('slot'));
    if (slot) await commands.executeCommand(`${EXTENSION_NAME}.quickSlot${slot}`);
  },
  '/assign-quick-slot': async (params) => {
    const name = validateName(params.get('name'));
    const slot = validateSlot(params.get('slot'));
    if (name && slot) await commands.executeCommand(`${EXTENSION_NAME}.assignQuickSlot`, name, slot);
  }
};

export function createUriHandler(): Disposable {
  return window.registerUriHandler({
    async handleUri(uri: Uri) {
      const handler = uriCommandMap[uri.path];
      if (handler) {
        const params = new URLSearchParams(uri.query);
        try {
          await handler(params);
        } catch (error) {
          console.error(`[TabStack] URI handler error for ${uri.path}:`, error);
        }
      }
    }
  });
}
