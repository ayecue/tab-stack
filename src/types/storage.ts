export interface StorageFile<T> {
  data: T;

  load(): Promise<void>;
  save(data: T): Promise<void>;
  clear(): Promise<void>;
}
