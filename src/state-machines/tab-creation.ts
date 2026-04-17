import { schedule } from 'non-blocking-schedule';
import { Tab, TabChangeEvent, window } from 'vscode';
import {
  and,
  assign,
  enqueueActions,
  fromCallback,
  or,
  setup,
  stopChild
} from 'xstate';

import { TabCreationTask } from '../handlers/tab-creation-task';
import { TabCreationEvent } from '../types/tab-creation';
import { AssociatedTabInstance } from '../types/tabs';

export const tabCreationMachine = setup({
  types: {
    context: {} as {
      tab: Tab | null;
      editor: AssociatedTabInstance | null;
      reachedNextTick: boolean;
      exceeded: boolean;
      failed: boolean;
      finalized: boolean;
      error: any;
      task: TabCreationTask;
    },
    input: {} as { task: TabCreationTask },
    events: {} as TabCreationEvent
  },
  guards: {
    shouldComplete({ context }) {
      if (context.finalized) return false;
      if (context.failed) return true;
      if (context.exceeded) return true;
      if (context.reachedNextTick && context.tab != null) return true;
      return false;
    }
  },
  actors: {
    tabListener: fromCallback<TabCreationEvent, TabCreationTask>(
      ({ sendBack, input }) => {
        const disposable = window.tabGroups.onDidChangeTabs(
          (e: TabChangeEvent) => {
            const tab = input.findRelatedTab(e.opened);
            if (tab) sendBack({ type: 'TAB_FOUND', tab });
          }
        );
        return () => disposable.dispose();
      }
    ),
    editorListener: fromCallback<TabCreationEvent, TabCreationTask>(
      ({ sendBack, input }) => {
        const disposable = input.addEditorListener((handle) => {
          sendBack({ type: 'EDITOR_FOUND', handle });
        });
        return () => disposable.dispose();
      }
    ),
    commandRunner: fromCallback<TabCreationEvent, TabCreationTask>(
      ({ sendBack, input }) => {
        input.executeCommand().then(
          () => {
            const delay = input.getNextTickDelay();
            if (delay > 0) {
              setTimeout(() => sendBack({ type: 'NEXT_TICK' }), delay);
              return;
            }
            schedule(() => sendBack({ type: 'NEXT_TICK' }));
          },
          (error: any) => sendBack({ type: 'COMMAND_FAILED', error })
        );
      }
    ),
    timeoutTimer: fromCallback<TabCreationEvent, TabCreationTask>(
      ({ sendBack, input }) => {
        const timer = setTimeout(
          () => sendBack({ type: 'TIMEOUT' }),
          input.getMaxRuntime()
        );
        return () => clearTimeout(timer);
      }
    )
  }
}).createMachine({
  id: 'tabCreation',
  initial: 'running',
  context: ({ input }) => ({
    tab: null,
    editor: null,
    reachedNextTick: false,
    exceeded: false,
    finalized: false,
    failed: false,
    error: null,
    task: input.task
  }),
  states: {
    running: {
      invoke: [
        {
          id: 'tabListener',
          src: 'tabListener',
          input: ({ context }) => context.task
        },
        {
          id: 'editorListener',
          src: 'editorListener',
          input: ({ context }) => context.task
        },
        {
          id: 'commandRunner',
          src: 'commandRunner',
          input: ({ context }) => context.task
        },
        {
          id: 'timeoutTimer',
          src: 'timeoutTimer',
          input: ({ context }) => context.task
        }
      ],
      always: {
        guard: 'shouldComplete',
        target: 'done'
      },
      on: {
        TAB_FOUND: { actions: assign({ tab: ({ event }) => event.tab }) },
        EDITOR_FOUND: {
          actions: assign({ editor: ({ event }) => event.handle })
        },
        NEXT_TICK: { actions: assign({ reachedNextTick: true }) },
        TIMEOUT: { actions: assign({ exceeded: true }) },
        COMMAND_FAILED: {
          actions: assign({ failed: true, error: ({ event }) => event.error })
        }
      }
    },
    done: {
      type: 'final',
      entry: [
        assign({ finalized: true }),
        stopChild('tabListener'),
        stopChild('editorListener'),
        stopChild('commandRunner'),
        stopChild('timeoutTimer')
      ]
    }
  }
});
