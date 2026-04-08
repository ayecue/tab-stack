const vscode = require('vscode');

const { CaptureSerializer } = require('./capture-serializer.cjs');

let rawEventCapture = null;

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('eventAnalyzer.startCapture', () => {
      if (rawEventCapture) {
        rawEventCapture.disposables.forEach((d) => d.dispose());
      }

      const serializer = new CaptureSerializer();
      const initialSnapshot = serializer.reset(vscode.window.tabGroups.all);

      rawEventCapture = {
        seq: 0,
        tabEvents: [],
        groupEvents: [],
        observedEvents: [],
        snapshotDiffs: [],
        initialSnapshot,
        serializer,
        disposables: [],
      };

      const capture = rawEventCapture;

      capture.disposables.push(
        vscode.window.tabGroups.onDidChangeTabs((e) => {
          const timestamp = Date.now();
          const seq = capture.seq++;
          const { observedEvent, snapshotDiff } = capture.serializer.recordTabEvent(
            e,
            vscode.window.tabGroups.all,
            seq,
            timestamp,
          );

          capture.tabEvents.push({
            seq,
            timestamp,
            ...observedEvent.event,
          });
          capture.observedEvents.push(observedEvent);
          capture.snapshotDiffs.push(snapshotDiff);
        }),
        vscode.window.tabGroups.onDidChangeTabGroups((e) => {
          const timestamp = Date.now();
          const seq = capture.seq++;
          const { observedEvent, snapshotDiff } = capture.serializer.recordGroupEvent(
            e,
            vscode.window.tabGroups.all,
            seq,
            timestamp,
          );

          capture.groupEvents.push({
            seq,
            timestamp,
            ...observedEvent.event,
          });
          capture.observedEvents.push(observedEvent);
          capture.snapshotDiffs.push(snapshotDiff);
        })
      );

      return true;
    }),

    vscode.commands.registerCommand('eventAnalyzer.stopCapture', () => {
      if (rawEventCapture) {
        rawEventCapture.disposables.forEach((d) => d.dispose());
        rawEventCapture.disposables = [];
      }
      return true;
    }),

    vscode.commands.registerCommand('eventAnalyzer.getEvents', (clear = false) => {
      if (!rawEventCapture) {
        return {
          tabEvents: [],
          groupEvents: [],
          observedEvents: [],
          snapshotDiffs: [],
          initialSnapshot: null,
          finalSnapshot: null,
        };
      }
      const result = {
        tabEvents: [...rawEventCapture.tabEvents],
        groupEvents: [...rawEventCapture.groupEvents],
        observedEvents: [...rawEventCapture.observedEvents],
        snapshotDiffs: [...rawEventCapture.snapshotDiffs],
        initialSnapshot: rawEventCapture.initialSnapshot,
        finalSnapshot:
          rawEventCapture.serializer.currentSnapshot ?? rawEventCapture.initialSnapshot,
      };
      if (clear) {
        rawEventCapture.tabEvents = [];
        rawEventCapture.groupEvents = [];
        rawEventCapture.observedEvents = [];
        rawEventCapture.snapshotDiffs = [];
        rawEventCapture.seq = 0;
        rawEventCapture.initialSnapshot = rawEventCapture.serializer.reset(
          vscode.window.tabGroups.all,
        );
      }
      return result;
    }),

    vscode.commands.registerCommand('eventAnalyzer.getSnapshot', () => {
      if (rawEventCapture?.serializer) {
        return (
          rawEventCapture.serializer.currentSnapshot ??
          rawEventCapture.serializer.reset(vscode.window.tabGroups.all)
        );
      }

      const serializer = new CaptureSerializer();
      return serializer.reset(vscode.window.tabGroups.all);
    })
  );
}

function deactivate() {
  if (rawEventCapture) {
    rawEventCapture.disposables.forEach((d) => d.dispose());
    rawEventCapture = null;
  }
}

module.exports = { activate, deactivate };
