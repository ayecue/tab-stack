import { Actor, createActor } from "xstate";
import { OpenTabResult } from "../types/tabs";
import { getLogger, ScopedLogger } from "../services/logger";
import { tabCreationMachine } from "../state-machines/tab-creation";
import { TabCreationTask } from "../handlers/tab-creation-task";
import { TabOperation } from "./tab-operation";


export class TabCreationOperation extends TabOperation {
  private _task: TabCreationTask;
  private _actor: Actor<typeof tabCreationMachine>;
  private _log: ScopedLogger;

  private _resolve: (result: OpenTabResult) => void;
  private _promise: Promise<OpenTabResult>;

  constructor(task: TabCreationTask) {
    super();
    this._task = task;
    this._actor = createActor(tabCreationMachine, {
      input: { task },
    });
    this._log = getLogger().child('TabCreationOperation');
    this._resolve = null;
    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
    this._actor.subscribe((snapshot) => {
      if (snapshot.status !== 'done') return;

      const { tab, editor, failed, error, exceeded } = snapshot.context;

      if (failed) {
        this._log.error(`failed to open ${this._task.getDescription()}`, error);
        this._resolve!({ success: false, handle: null, tab: null });
        return;
      }

      if (tab == null) {
        this._log.warn(`${this._task.getDescription()} not found in any tab group after ${exceeded ? 'timeout' : 'executing command'}`);
        this._resolve!({ success: false, handle: editor, tab: null });
        return;
      }

      this._resolve!({ success: true, handle: editor, tab });
    });
  }

  async execute(): Promise<void> {
    this._actor.start();
    await this._promise;
  }

  getRelevantPromise() {
    return this._promise;
  }

  getDescription() {
    return this._task.getDescription();
  }
}
