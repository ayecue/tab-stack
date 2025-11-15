import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { EditorLayoutService } from '../../../src/services/editor-layout';
import { Layout } from '../../../src/types/commands';
import * as commands from '../../../src/utils/commands';

vi.mock('../../../src/utils/commands', () => ({
  getEditorLayout: vi.fn()
}));

describe('EditorLayoutService', () => {
  let service: EditorLayoutService;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (service) {
      service.dispose();
    }
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const createLayout = (orientation: number = 0): Layout => ({
    orientation,
    groups: [{ groups: [], size: 1 }]
  });

  describe('initialization', () => {
    it('creates service with default poll interval', () => {
      service = new EditorLayoutService();
      expect(service).toBeDefined();
    });

    it('creates service with custom poll interval', () => {
      service = new EditorLayoutService(500);
      expect(service).toBeDefined();
    });
  });

  describe('start and polling', () => {
    it('starts polling when start is called', async () => {
      const layout1 = createLayout(0);
      const layout2 = createLayout(1);

      vi.mocked(commands.getEditorLayout)
        .mockResolvedValueOnce(layout1)
        .mockResolvedValueOnce(layout2);

      service = new EditorLayoutService(100);

      const layoutChanges: Layout[] = [];
      service.onDidChangeLayout((layout) => {
        layoutChanges.push(layout);
      });

      service.start();

      // Fast forward past first poll
      await vi.advanceTimersByTimeAsync(100);
      
      // Fast forward past second poll
      await vi.advanceTimersByTimeAsync(100);

      expect(layoutChanges).toHaveLength(1);
      expect(layoutChanges[0]).toEqual(layout2);
    });

    it('does not start multiple times', async () => {
      const layout = createLayout();
      vi.mocked(commands.getEditorLayout).mockResolvedValue(layout);

      service = new EditorLayoutService(100);
      service.start();
      service.start();
      service.start();

      await vi.advanceTimersByTimeAsync(100);

      // Should only call once per interval, not multiple times
      expect(commands.getEditorLayout).toHaveBeenCalledTimes(1);
    });

    it('does not emit event when layout has not changed', async () => {
      const layout = createLayout();
      vi.mocked(commands.getEditorLayout).mockResolvedValue(layout);

      service = new EditorLayoutService(100);

      const listener = vi.fn();
      service.onDidChangeLayout(listener);

      service.start();

      // First poll sets initial layout
      await vi.advanceTimersByTimeAsync(100);
      
      // Second poll detects no change
      await vi.advanceTimersByTimeAsync(100);

      expect(listener).not.toHaveBeenCalled();
    });

    it('emits event only when layout changes', async () => {
      const layout1 = createLayout(0);
      const layout2 = createLayout(1);
      const layout3 = createLayout(1); // Same as layout2

      vi.mocked(commands.getEditorLayout)
        .mockResolvedValueOnce(layout1)
        .mockResolvedValueOnce(layout2)
        .mockResolvedValueOnce(layout3);

      service = new EditorLayoutService(100);

      const layoutChanges: Layout[] = [];
      service.onDidChangeLayout((layout) => {
        layoutChanges.push(layout);
      });

      service.start();

      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(100);

      // Should only emit once when layout actually changes
      expect(layoutChanges).toHaveLength(1);
      expect(layoutChanges[0]).toEqual(layout2);
    });
  });

  describe('setLayout', () => {
    it('manually sets the current layout', async () => {
      const manualLayout = createLayout(1);

      vi.mocked(commands.getEditorLayout).mockResolvedValue(manualLayout);

      service = new EditorLayoutService(100);
      service.setLayout(manualLayout);

      const listener = vi.fn();
      service.onDidChangeLayout(listener);

      service.start();

      await vi.advanceTimersByTimeAsync(100);

      // Should not emit because manual layout matches polled layout
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('dispose', () => {
    it('stops polling and cleans up', async () => {
      const layout = createLayout();
      vi.mocked(commands.getEditorLayout).mockResolvedValue(layout);

      service = new EditorLayoutService(100);
      service.start();

      await vi.advanceTimersByTimeAsync(100);
      const callsBeforeDispose = vi.mocked(commands.getEditorLayout).mock.calls.length;

      service.dispose();

      // Clear the mock to reset call count
      vi.clearAllMocks();

      // Advance time and ensure no more calls happen
      await vi.advanceTimersByTimeAsync(300);
      
      // Should not have been called after dispose
      expect(commands.getEditorLayout).not.toHaveBeenCalled();
    });

    it('allows dispose to be called multiple times safely', () => {
      service = new EditorLayoutService(100);
      service.dispose();
      
      // Second dispose should not throw even though _emitter is null
      expect(() => {
        service.dispose();
      }).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('handles errors during layout evaluation gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      vi.mocked(commands.getEditorLayout).mockRejectedValue(new Error('Failed to get layout'));

      service = new EditorLayoutService(100);
      const listener = vi.fn();
      service.onDidChangeLayout(listener);

      service.start();

      await vi.advanceTimersByTimeAsync(100);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to check editor layout',
        expect.any(Error)
      );
      expect(listener).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('continues polling after error', async () => {
      const layout = createLayout();
      
      vi.mocked(commands.getEditorLayout)
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockResolvedValueOnce(layout);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      service = new EditorLayoutService(100);
      service.start();

      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(100);

      expect(commands.getEditorLayout).toHaveBeenCalledTimes(2);

      consoleWarnSpy.mockRestore();
    });
  });
});
