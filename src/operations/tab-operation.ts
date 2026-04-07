import { OpenTabResult } from "../types/tabs";

export abstract class TabOperation {
  abstract execute(): Promise<void>;
  abstract getRelevantPromise(): Promise<OpenTabResult>;
  abstract getDescription(): string;
}
