import { emit, setup } from 'xstate';

import { TabChangeBatchCoordinator } from '../handlers/tab-change-batch-coordinator';
import { TabObserverService } from '../services/tab-observer';
import {
  TabBufferContext,
  TabBufferEmitted,
  TabBufferEvent
} from '../types/tab-change-proxy';

export const BUFFER_DELAY = 100;

export const tabBufferMachine = setup({
  types: {
    context: {} as TabBufferContext,
    events: {} as TabBufferEvent,
    emitted: {} as TabBufferEmitted,
    input: {} as {
      observer: TabChangeBatchCoordinator;
      tabObserverService: TabObserverService;
    }
  },
  delays: {
    BUFFER_DELAY
  }
}).createMachine({
  id: 'tabBuffer',
  initial: 'idle',
  context: ({ input }) => ({
    observer: input.observer,
    tabObserverService: input.tabObserverService
  }),
  states: {
    idle: {
      on: {
        RAW_TAB_EVENT: {
          target: 'buffering',
          actions: ({ context, event }) =>
            context.observer.record(event.observed)
        },
        RAW_GROUP_EVENT: {
          target: 'buffering',
          actions: ({ context, event }) =>
            context.observer.record(event.observed)
        },
        MUTE: {
          target: 'muted',
          actions: ({ context }) => {
            context.observer.reset();
            context.tabObserverService.mute();
          }
        }
      }
    },
    buffering: {
      after: {
        BUFFER_DELAY: {
          target: 'idle',
          actions: [
            emit(({ context }) => ({
              type: 'resolved' as const,
              event: context.observer.buildResolvedEvent()
            }))
          ]
        }
      },
      on: {
        RAW_TAB_EVENT: {
          target: 'buffering',
          reenter: true,
          actions: ({ context, event }) =>
            context.observer.record(event.observed)
        },
        RAW_GROUP_EVENT: {
          target: 'buffering',
          reenter: true,
          actions: ({ context, event }) =>
            context.observer.record(event.observed)
        },
        MUTE: {
          target: 'muted',
          actions: ({ context }) => {
            context.observer.reset();
            context.tabObserverService.mute();
          }
        }
      }
    },
    muted: {
      on: {
        UNMUTE: {
          target: 'idle',
          actions: ({ context }) => context.tabObserverService.unmute()
        }
      }
    }
  }
});
