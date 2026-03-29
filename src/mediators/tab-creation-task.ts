import { Actor, createActor } from "xstate";
import { OpenTabResult } from "../types/tabs";
import { getLogger, ScopedLogger } from "../services/logger";
import { tabCreationMachine } from "../state-machines/tab-creation";
import { TabCreationTask } from "../handlers/tab-creation-task";


export class TabCreationTaskMediator {
  private _task: TabCreationTask;
  private _actor: Actor<typeof tabCreationMachine>;
  private _log: ScopedLogger;

  private _resolve: (result: OpenTabResult) => void;
  private _promise: Promise<OpenTabResult>;

  constructor(task: TabCreationTask) {
    this._task = task;
    this._actor = createActor(tabCreationMachine, {
      input: { task },
    });
    this._log = getLogger().child('TabCreationTaskMediator');
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

  execute(): Promise<OpenTabResult> {
    this._actor.start();
    return this._promise;
  }

  getRelevantPromise() {
    return this._promise;
  }

  getDescription() {
    return this._task.getDescription();
  }
}