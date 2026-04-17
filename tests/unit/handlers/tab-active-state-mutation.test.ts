import { describe, expect, it, vi } from 'vitest';

import { TabActiveStateMutationHandler } from '../../../src/handlers/tab-active-state-mutation';
import { createTabActiveStateStore } from '../../../src/stores/tab-active-state';

describe('TabActiveStateMutationHandler', () => {
  it('locks and unlocks around a successful operation', async () => {
    const store = createTabActiveStateStore();
    const tabChangeMuteController = {
      mute: vi.fn(),
      unmute: vi.fn()
    };
    const effects = {
      rehydrateTabs: vi.fn(),
      scheduleStateUpdate: vi.fn()
    };
    const handler = new TabActiveStateMutationHandler(
      store,
      tabChangeMuteController,
      effects
    );

    const result = await handler.runLocked(async () => {
      expect(handler.isLocked).toBe(true);
      expect(store.getSnapshot().context.isLocked).toBe(true);
      return 'ok';
    });

    expect(result).toBe('ok');
    expect(handler.isLocked).toBe(false);
    expect(store.getSnapshot().context.isLocked).toBe(false);
    expect(tabChangeMuteController.mute).toHaveBeenCalledTimes(1);
    expect(tabChangeMuteController.unmute).toHaveBeenCalledTimes(1);
    expect(effects.rehydrateTabs).toHaveBeenCalledTimes(1);
    expect(effects.scheduleStateUpdate).toHaveBeenCalledTimes(1);
  });

  it('unlocks and runs unlock effects when the operation throws', async () => {
    const store = createTabActiveStateStore();
    const tabChangeMuteController = {
      mute: vi.fn(),
      unmute: vi.fn()
    };
    const effects = {
      rehydrateTabs: vi.fn(),
      scheduleStateUpdate: vi.fn()
    };
    const handler = new TabActiveStateMutationHandler(
      store,
      tabChangeMuteController,
      effects
    );

    await expect(
      handler.runLocked(async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');

    expect(handler.isLocked).toBe(false);
    expect(store.getSnapshot().context.isLocked).toBe(false);
    expect(tabChangeMuteController.mute).toHaveBeenCalledTimes(1);
    expect(tabChangeMuteController.unmute).toHaveBeenCalledTimes(1);
    expect(effects.rehydrateTabs).toHaveBeenCalledTimes(1);
    expect(effects.scheduleStateUpdate).toHaveBeenCalledTimes(1);
  });
});