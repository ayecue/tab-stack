import { describe, expect, it, vi, beforeEach } from 'vitest';
import { workspace, Uri } from 'vscode';
import { getWorkspaceFolder } from '../../../src/utils/get-workspace-folder';

describe('getWorkspaceFolder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the first workspace folder URI when folders exist', () => {
    const mockUri = Uri.file('/test/workspace');
    const mockFolder = {
      uri: mockUri,
      name: 'test-workspace',
      index: 0
    };

    vi.spyOn(workspace, 'workspaceFolders', 'get').mockReturnValue([mockFolder]);

    const result = getWorkspaceFolder();

    expect(result).toBe(mockUri.toString());
  });

  it('returns null when no workspace folders exist', () => {
    vi.spyOn(workspace, 'workspaceFolders', 'get').mockReturnValue(undefined);

    const result = getWorkspaceFolder();

    expect(result).toBeNull();
  });

  it('returns null when workspace folders array is empty', () => {
    vi.spyOn(workspace, 'workspaceFolders', 'get').mockReturnValue([]);

    const result = getWorkspaceFolder();

    expect(result).toBeNull();
  });

  it('returns first folder when multiple workspace folders exist', () => {
    const mockUri1 = Uri.file('/test/workspace1');
    const mockUri2 = Uri.file('/test/workspace2');
    const mockFolders = [
      { uri: mockUri1, name: 'workspace1', index: 0 },
      { uri: mockUri2, name: 'workspace2', index: 1 }
    ];

    vi.spyOn(workspace, 'workspaceFolders', 'get').mockReturnValue(mockFolders);

    const result = getWorkspaceFolder();

    expect(result).toBe(mockUri1.toString());
  });
});
