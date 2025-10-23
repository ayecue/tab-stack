import { StorageFile } from '../types/storage';

export class InMemoryJsonFile<T> implements StorageFile<T> {
  private _data: T | null;
  private _defaultDataProvider: () => T;

  constructor(defaultDataProvider: () => T) {
    this._data = defaultDataProvider();
    this._defaultDataProvider = defaultDataProvider;
  }

  async load() {
    await this.save(this._defaultDataProvider()).catch(console.error);
  }

  get data(): T {
    return this._data;
  }

  set data(value: T) {
    this._data = value;
  }

  async save(data: T) {
    this._data = data;
  }

  async clear() {
    this._data = null;
  }
}
