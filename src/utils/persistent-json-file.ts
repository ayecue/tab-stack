import { Uri, workspace } from 'vscode';

import { StorageFile } from '../types/storage';

export class PersistentJsonFile<T> implements StorageFile<T> {
  private _data: T | null;
  private _filePath: Uri;
  private _defaultDataProvider: () => T;

  constructor(filePath: Uri, defaultDataProvider: () => T) {
    this._filePath = filePath;
    this._data = defaultDataProvider();
    this._defaultDataProvider = defaultDataProvider;
  }

  async load() {
    try {
      const fileContent = await workspace.fs.readFile(this._filePath);
      const decoder = new TextDecoder();
      this._data = JSON.parse(decoder.decode(fileContent)) as T;
    } catch (error) {
      this.save(this._defaultDataProvider()).catch(console.error);
    }
  }

  get data(): T {
    return this._data;
  }

  set data(value: T) {
    this._data = value;
  }

  async save(data: T) {
    this._data = data;
    const fileContent = JSON.stringify(data);
    await workspace.fs.writeFile(this._filePath, Buffer.from(fileContent));
  }

  async clear() {
    this._data = null;
    await workspace.fs.delete(this._filePath);
  }
}
