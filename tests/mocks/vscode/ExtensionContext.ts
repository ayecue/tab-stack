import { vi } from 'vitest';
import type { ExtensionContext } from 'vscode';

export class MockExtensionContext {
  public subscriptions: any[] = [];
  public workspaceState = {
    get: vi.fn(),
    update: vi.fn(),
    keys: vi.fn(() => [])
  };
  public globalState = {
    get: vi.fn(),
    update: vi.fn(),
    setKeysForSync: vi.fn(),
    keys: vi.fn(() => [])
  };
  public extensionPath = '/mock/extension/path';
  public extensionUri = { fsPath: '/mock/extension/path' } as any;
  public storagePath = '/mock/storage/path';
  public globalStoragePath = '/mock/global/storage/path';
  public logPath = '/mock/log/path';
  public extensionMode = 1; // production
  public storageUri = { fsPath: '/mock/storage/path' } as any;
  public globalStorageUri = { fsPath: '/mock/global/storage/path' } as any;
  public logUri = { fsPath: '/mock/log/path' } as any;
  public secrets = {
    get: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    onDidChange: vi.fn(() => ({ dispose: vi.fn() }))
  };
  public environmentVariableCollection = {
    persistent: true,
    description: 'Mock environment variables',
    replace: vi.fn(),
    append: vi.fn(),
    prepend: vi.fn(),
    get: vi.fn(),
    forEach: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
    getScoped: vi.fn()
  } as any;
  public extension = {
    id: 'mock.extension',
    extensionUri: this.extensionUri,
    extensionPath: this.extensionPath,
    isActive: true,
    packageJSON: {},
    exports: undefined,
    activate: vi.fn(),
    extensionKind: 1
  } as any;
  public asAbsolutePath = vi.fn((relativePath: string) => `/mock/extension/path/${relativePath}`);
  
  constructor() {
    this.workspaceState.get.mockReturnValue(undefined);
    this.workspaceState.update.mockResolvedValue(undefined);
    this.globalState.get.mockReturnValue(undefined);
    this.globalState.update.mockResolvedValue(undefined);
  }
}

export function createMockExtensionContext(): ExtensionContext {
  return new MockExtensionContext() as any as ExtensionContext;
}
