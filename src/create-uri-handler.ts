import { commands, Disposable, Uri, window } from 'vscode';

import { EXTENSION_NAME } from './types/extension';

type UriRouteHandler = (params: URLSearchParams) => Promise<void>;

const uriCommandMap: Record<string, UriRouteHandler> = {
  '/switch-group': async (params) => {
    const name = params.get('name');
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.switchGroup`, name);
  },
  '/create-group': async (params) => {
    const name = params.get('name');
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.createGroup`, name);
  },
  '/delete-group': async (params) => {
    const name = params.get('name');
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.deleteGroup`, name);
  },
  '/snapshot': async () => {
    await commands.executeCommand(`${EXTENSION_NAME}.snapshot`);
  },
  '/restore-snapshot': async (params) => {
    const name = params.get('name');
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.restoreSnapshot`, name);
  },
  '/apply-addon': async (params) => {
    const name = params.get('name');
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.applyAddon`, name);
  },
  '/import-group': async (params) => {
    const file = params.get('file');
    if (file) await commands.executeCommand(`${EXTENSION_NAME}.importGroup`, file);
  },
  '/export-group': async (params) => {
    const name = params.get('name');
    if (name) await commands.executeCommand(`${EXTENSION_NAME}.exportGroup`, name);
  },
  '/quick-switch': async () => {
    await commands.executeCommand(`${EXTENSION_NAME}.quickSwitch`);
  },
  '/quick-slot': async (params) => {
    const slot = params.get('slot');
    if (slot) await commands.executeCommand(`${EXTENSION_NAME}.quickSlot${slot}`);
  },
  '/assign-quick-slot': async (params) => {
    const name = params.get('name');
    const slot = params.get('slot');
    if (name && slot) await commands.executeCommand(`${EXTENSION_NAME}.assignQuickSlot`, name, slot);
  }
};

export function createUriHandler(): Disposable {
  return window.registerUriHandler({
    async handleUri(uri: Uri) {
      const handler = uriCommandMap[uri.path];
      if (handler) {
        const params = new URLSearchParams(uri.query);
        await handler(params);
      }
    }
  });
}
