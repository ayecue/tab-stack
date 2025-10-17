export interface StorageFile<T> {
  readonly data: T;

  load(): Promise<void>;
  save(data: T): Promise<void>;
  clear(): Promise<void>;
}
