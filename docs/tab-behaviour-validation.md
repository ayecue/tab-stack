# Tab Behaviour Validation

This document compares the claims in [tab-behaviour.md](./tab-behaviour.md) against the current automated analyzer captures in [event-analyzer/index.md](../tests/fixtures/event-analyzer/index.md).

Status meanings:

- Proven: The current automated captures support the claim across the covered setups.
- Disproven: The current automated captures contradict the claim.
- Conditional: The claim is only partially covered, mixes supported and unsupported sub-claims, or still lacks direct capture coverage.

Current summary:

- Proven: 20
- Disproven: 0
- Conditional: 6

Pipeline verification:

- The analyzer-focused unit suite now replays all 80 analyzer fixtures through the current batch coordinator and resolver.
- [tab-change-pipeline.analyzer.test.ts](../tests/unit/handlers/tab-change-pipeline.analyzer.test.ts) checks resolved-event coherence against captured before and after snapshots for every scenario.
- [tab-change-pipeline.analyzer.test.ts.snap](../tests/unit/handlers/__snapshots__/tab-change-pipeline.analyzer.test.ts.snap) stores normalized output snapshots for the full corpus, so resolver output changes are now explicit regressions instead of relying only on representative hand-authored assertions.
- [tab-behaviour-validation.analyzer.test.ts](../tests/unit/handlers/tab-behaviour-validation.analyzer.test.ts) now checks that every analyzer scenario is either direct evidence for a validation row or explicitly marked as auxiliary coverage, and that every evidence scenario still satisfies the claim attached to that row.
- `npm run audit:pipeline:semantics` generates a separate non-gating semantic audit report under `tools/vscode-event-analyzer/output/` that compares endpoint-derived expectations against resolver `tabRewireDeltas` and highlights suspicious scenario families for follow-up.
- This replay harness verifies pipeline behavior against the fixture corpus; it does not change the claim statuses below, which remain based on the analyzer captures and the direct-versus-approximation distinction.

Auxiliary scenario coverage:

- [I](../tests/fixtures/event-analyzer/scenarios/09-i-duplicate-in-another-column.md), [O](../tests/fixtures/event-analyzer/scenarios/15-o-group-swap-close.md), [P](../tests/fixtures/event-analyzer/scenarios/16-p-group-move-reorder.md), and [Q](../tests/fixtures/event-analyzer/scenarios/17-q-close-middle-group.md) remain useful pipeline regression scenarios, but they are mixed or composite cases rather than direct evidence rows in [tab-behaviour.md](./tab-behaviour.md).
- [V1](../tests/fixtures/event-analyzer/scenarios/26-v1-dirty-then-save-1vc.md), [V2](../tests/fixtures/event-analyzer/scenarios/27-v2-dirty-then-save-2vc.md), and [V3](../tests/fixtures/event-analyzer/scenarios/28-v3-dirty-then-save-4vc.md) are dirty/save cycles. The resolver records `isDirty` activity, but the scenario endpoints begin and end clean, so they are not direct endpoint evidence for a one-way save row.
- [W1](../tests/fixtures/event-analyzer/scenarios/29-w1-pin-then-unpin-1vc.md), [W2](../tests/fixtures/event-analyzer/scenarios/30-w2-pin-then-unpin-1vc-many.md), and [W3](../tests/fixtures/event-analyzer/scenarios/31-w3-pin-then-unpin-3vc.md) are pin/unpin cycles. The single-step pin capture is still direct evidence, but these round trips are better treated as auxiliary coverage than as isolated proof of an unpin outcome.

## Tab Events

### User clicks on tab

Status: Proven

Evidence: [H](../tests/fixtures/event-analyzer/scenarios/08-h-activate-different-tab.md), [AH1](../tests/fixtures/event-analyzer/scenarios/60-ah1-activate-different-tab-2vc-active-group.md), [AH2](../tests/fixtures/event-analyzer/scenarios/61-ah2-activate-different-tab-4vc-focused-group.md)

Notes: Across the one-group, two-group, and four-group captures, activating a different tab flips the active tab inside the focused group and deactivates the previously active tab without changing tab order or group layout.

### User clicks on tab close button

Status: Proven

Evidence: [B](../tests/fixtures/event-analyzer/scenarios/02-b-close-a-single-tab.md), [J](../tests/fixtures/event-analyzer/scenarios/10-j-close-last-in-group.md), [AF1](../tests/fixtures/event-analyzer/scenarios/56-af1-close-single-tab-1vc-populated.md), [AF2](../tests/fixtures/event-analyzer/scenarios/57-af2-close-single-tab-4vc-populated-middle-group.md)

Notes: Last-tab close, empty-group closure, and populated-group close are now all captured. In the populated-group cases, the immediate right neighbor becomes active and tabs to the right shift left.

### User presses on close other tabs

Status: Proven

Evidence: [T1](../tests/fixtures/event-analyzer/scenarios/20-t1-close-other-tabs-1vc.md), [T2](../tests/fixtures/event-analyzer/scenarios/21-t2-close-other-tabs-2vc.md), [T3](../tests/fixtures/event-analyzer/scenarios/22-t3-close-other-tabs-4vc.md)

Notes: The non-selected tabs close within the same group. When the kept tab was not active, it becomes active as part of the collapse.

### User opens file in active Tab Group

Status: Proven

Evidence: [A](../tests/fixtures/event-analyzer/scenarios/01-a-open-a-single-file.md), [AE1](../tests/fixtures/event-analyzer/scenarios/53-ae1-open-file-in-active-group-1vc-populated.md), [AE2](../tests/fixtures/event-analyzer/scenarios/54-ae2-open-file-in-active-group-3vc-populated.md), [AE3](../tests/fixtures/event-analyzer/scenarios/55-ae3-reopen-same-file-in-active-group-1vc.md)

Notes: Opening a new file into the active group and making it active is now captured for empty and populated layouts. In the populated-group cases, the new tab is inserted immediately to the right of the previously active tab; reopening a file already open in the same group reuses the existing tab and activates it instead of creating a duplicate.

### User drags tab to new position within same Tab Group

Status: Proven

Evidence: [D](../tests/fixtures/event-analyzer/scenarios/04-d-reorder-within-group.md), [K](../tests/fixtures/event-analyzer/scenarios/11-k-multi-step-reorder.md), [AO](../tests/fixtures/event-analyzer/scenarios/80-ao-rightward-multi-step-reorder.md)

Notes: Direct same-group index movement is now captured across three layouts: a one-step left move, a multi-step left move to the front, and a multi-step right move to the end. In each case the moved tab lands at the expected index and the intermediate neighbors shift around it without changing group layout.

### User drags tab to other existing Tab Group

Status: Proven

Evidence: [C](../tests/fixtures/event-analyzer/scenarios/03-c-move-tab-cross-column.md), [N](../tests/fixtures/event-analyzer/scenarios/14-n-multi-hop-tab-move.md), [S](../tests/fixtures/event-analyzer/scenarios/19-s-cross-group-with-index.md), [AA1](../tests/fixtures/event-analyzer/scenarios/41-aa1-duplicate-target-move-2vc.md), [AA2](../tests/fixtures/event-analyzer/scenarios/42-aa2-duplicate-target-move-3vc.md), [AA3](../tests/fixtures/event-analyzer/scenarios/43-aa3-duplicate-target-move-5vc.md)

Notes: The target group receives the moved tab, target activation changes are captured, source and target tab indices update, and the duplicate-target evaporation edge case is now directly covered.

### User drags tab to create new Tab Group

Status: Proven

Evidence: [U1](../tests/fixtures/event-analyzer/scenarios/23-u1-move-tab-to-new-group-1vc.md), [U2](../tests/fixtures/event-analyzer/scenarios/24-u2-move-tab-to-new-group-3vc.md), [U3](../tests/fixtures/event-analyzer/scenarios/25-u3-move-tab-to-new-group-5vc.md)

Notes: The new group is created to the right, becomes active, and the tab leaves the source group.

### User splits editor with active tab

Status: Proven

Evidence: [R](../tests/fixtures/event-analyzer/scenarios/18-r-split-editor.md), [AG1](../tests/fixtures/event-analyzer/scenarios/58-ag1-split-editor-1vc-populated.md), [AG2](../tests/fixtures/event-analyzer/scenarios/59-ag2-split-editor-3vc-middle-group.md)

Notes: The current spec now matches the captures across all three setups: split editor duplicates the active editor into the new group while the original remains in the source group, and splitting a middle group inserts the new group before the groups that were already to its right.

### User selects multiple tabs and drags to new position within same Tab Group

Status: Conditional

Evidence: [AN1](../tests/fixtures/event-analyzer/scenarios/77-an1-multi-tab-same-group-approximation-1vc-rightward-pair.md), [AN2](../tests/fixtures/event-analyzer/scenarios/78-an2-multi-tab-same-group-approximation-1vc-middle-triple-to-end.md), [AN3](../tests/fixtures/event-analyzer/scenarios/79-an3-multi-tab-same-group-approximation-1vc-late-pair-to-front.md)

Notes: Sequential per-file `moveEditorLeftInGroup` and `moveEditorRightInGroup` commands reproduce the expected block-reorder layout across all three captured setups: the selected files end up contiguous in the target order and the surrounding tabs shift around them accordingly. This remains conditional because the capture is a command approximation, not a direct multi-select drag trace.

### User selects multiple tabs and drags to other existing Tab Group

Status: Conditional

Evidence: [AJ1](../tests/fixtures/event-analyzer/scenarios/65-aj1-multi-tab-cross-group-approximation-2vc-2-tabs.md), [AJ2](../tests/fixtures/event-analyzer/scenarios/66-aj2-multi-tab-cross-group-approximation-3vc-2-tabs.md), [AJ3](../tests/fixtures/event-analyzer/scenarios/67-aj3-multi-tab-cross-group-approximation-5vc-2-tabs.md)

Notes: Parallel per-file `moveEditorToRightGroup` commands reproduce the high-level layout result across the two-group, three-group, and five-group setups: the selected files leave the source group, appear in the target group, and the target group becomes active. This remains conditional because the capture is a command approximation, not a direct multi-select drag trace.

### User selects multiple tabs and drags to create new Tab Group

Status: Conditional

Evidence: [AK1](../tests/fixtures/event-analyzer/scenarios/68-ak1-multi-tab-new-group-approximation-1vc-2-tabs.md), [AK2](../tests/fixtures/event-analyzer/scenarios/69-ak2-multi-tab-new-group-approximation-3vc-2-tabs.md), [AK3](../tests/fixtures/event-analyzer/scenarios/70-ak3-multi-tab-new-group-approximation-5vc-2-tabs.md)

Notes: Parallel per-file `moveEditorToRightGroup` commands also reproduce the high-level new-group result in the captured one-group, three-group, and five-group setups: VS Code creates the new group to the right, the moved files leave the source group, and the new group becomes active. This remains conditional because the capture is command-driven rather than a direct selected-tab drag.

### User selects multiple tabs and splits editor

Status: Conditional

Evidence: [AL1](../tests/fixtures/event-analyzer/scenarios/71-al1-multi-tab-split-approximation-1vc-2-tabs.md), [AL2](../tests/fixtures/event-analyzer/scenarios/72-al2-multi-tab-split-approximation-3vc-2-tabs.md), [AL3](../tests/fixtures/event-analyzer/scenarios/73-al3-multi-tab-split-approximation-5vc-2-tabs.md)

Notes: Creating the target group and then opening the same files into it in parallel reproduces the expected duplicate-into-new-group outcome across the captured setups: the originals remain in the source group, duplicates appear in the new group, and the new group becomes active. This remains conditional because the direct multi-select split gesture is still unverified.

### User drags tab to existing Tab Group, while the Tab Group already has the same file open

Status: Proven

Evidence: [AA1](../tests/fixtures/event-analyzer/scenarios/41-aa1-duplicate-target-move-2vc.md), [AA2](../tests/fixtures/event-analyzer/scenarios/42-aa2-duplicate-target-move-3vc.md), [AA3](../tests/fixtures/event-analyzer/scenarios/43-aa3-duplicate-target-move-5vc.md)

Notes: The moved tab closes instead of surviving as a second copy in the target group.

### User drags last remaining tab out of a Tab Group

Status: Proven

Evidence: [AB1](../tests/fixtures/event-analyzer/scenarios/44-ab1-last-tab-move-out-2vc.md), [AB2](../tests/fixtures/event-analyzer/scenarios/45-ab2-last-tab-move-out-3vc.md), [AB3](../tests/fixtures/event-analyzer/scenarios/46-ab3-last-tab-move-out-5vc.md)

Notes: The tab reaches the target group, the source group closes, and groups to the right of the closed source group shift left.

### User drags last remaining tab out of a Tab Group, target already has the same file open

Status: Proven

Evidence: [AC1](../tests/fixtures/event-analyzer/scenarios/47-ac1-last-tab-duplicate-move-2vc.md), [AC2](../tests/fixtures/event-analyzer/scenarios/48-ac2-last-tab-duplicate-move-3vc.md), [AC3](../tests/fixtures/event-analyzer/scenarios/49-ac3-last-tab-duplicate-move-5vc.md)

Notes: The dragged source tab closes, the source group closes, and groups to its right shift left.

### User changes text in tab thus it becomes dirty

Status: Proven

Evidence: [G](../tests/fixtures/event-analyzer/scenarios/07-g-dirty-a-tab.md)

Notes: [G](../tests/fixtures/event-analyzer/scenarios/07-g-dirty-a-tab.md) is the direct one-way dirty transition. The dirty/save cycle scenarios [V1](../tests/fixtures/event-analyzer/scenarios/26-v1-dirty-then-save-1vc.md), [V2](../tests/fixtures/event-analyzer/scenarios/27-v2-dirty-then-save-2vc.md), and [V3](../tests/fixtures/event-analyzer/scenarios/28-v3-dirty-then-save-4vc.md) remain useful auxiliary coverage, but they begin and end clean, so they are not direct endpoint proof for this row.

### User saves tab thus it becomes not dirty

Status: Conditional

Evidence: none direct yet

Notes: The current dirty/save cycle scenarios [V1](../tests/fixtures/event-analyzer/scenarios/26-v1-dirty-then-save-1vc.md), [V2](../tests/fixtures/event-analyzer/scenarios/27-v2-dirty-then-save-2vc.md), and [V3](../tests/fixtures/event-analyzer/scenarios/28-v3-dirty-then-save-4vc.md) do produce resolver activity touching `isDirty`, but their endpoints begin and end clean. That means the current whole-scenario pipeline outcome does not isolate a direct one-way save transition strongly enough to keep this row proven.

### User pins tab

Status: Proven

Evidence: [F](../tests/fixtures/event-analyzer/scenarios/06-f-pin-a-tab.md)

Notes: [F](../tests/fixtures/event-analyzer/scenarios/06-f-pin-a-tab.md) is the direct one-way pin capture. The pin/unpin cycle scenarios [W1](../tests/fixtures/event-analyzer/scenarios/29-w1-pin-then-unpin-1vc.md), [W2](../tests/fixtures/event-analyzer/scenarios/30-w2-pin-then-unpin-1vc-many.md), and [W3](../tests/fixtures/event-analyzer/scenarios/31-w3-pin-then-unpin-3vc.md) remain auxiliary because their endpoints return to the unpinned state.

### User unpins tab

Status: Conditional

Evidence: none direct yet

Notes: The current pin/unpin cycle scenarios [W1](../tests/fixtures/event-analyzer/scenarios/29-w1-pin-then-unpin-1vc.md), [W2](../tests/fixtures/event-analyzer/scenarios/30-w2-pin-then-unpin-1vc-many.md), and [W3](../tests/fixtures/event-analyzer/scenarios/31-w3-pin-then-unpin-3vc.md) do not isolate a direct one-way unpin endpoint. In the populated layouts they also include net reorder side-effects across the full cycle, so this row remains conditional until there is a dedicated unpin capture.

### User double clicks on tab

Status: Proven

Evidence: [AI1](../tests/fixtures/event-analyzer/scenarios/62-ai1-preview-promotion-1vc.md), [AI2](../tests/fixtures/event-analyzer/scenarios/63-ai2-preview-promotion-1vc-populated.md), [AI3](../tests/fixtures/event-analyzer/scenarios/64-ai3-preview-promotion-3vc-refocus.md)

Notes: The built-in `workbench.action.keepEditor` command provides a reliable automation path for preview promotion. Across all three captures, the only observed change is `isPreview: true -> false` on the active tab; tab order, active state, and group layout remain unchanged.

## Tab Group Events

### User clicks on tab group

Status: Proven

Evidence: [X1](../tests/fixtures/event-analyzer/scenarios/32-x1-group-activation-2vc.md), [X2](../tests/fixtures/event-analyzer/scenarios/33-x2-group-activation-3vc.md), [X3](../tests/fixtures/event-analyzer/scenarios/34-x3-group-activation-5vc.md)

Notes: Group activation flips `isActive` between groups without changing the tab layout.

### User clicks on tab group close button

Status: Proven

Evidence: [Y1](../tests/fixtures/event-analyzer/scenarios/35-y1-close-group-2vc-1-tab.md), [Y2](../tests/fixtures/event-analyzer/scenarios/36-y2-close-group-3vc-2-tabs.md), [Y3](../tests/fixtures/event-analyzer/scenarios/37-y3-close-group-5vc-3-tabs.md)

Notes: The closed group's tabs are removed, the group disappears, and groups to its right shift left. Active-group reassignment is also captured.

### User creates new tab group

Status: Proven

Evidence: [Z1](../tests/fixtures/event-analyzer/scenarios/38-z1-new-group-creation-1vc.md), [Z2](../tests/fixtures/event-analyzer/scenarios/39-z2-new-group-creation-3vc.md), [Z3](../tests/fixtures/event-analyzer/scenarios/40-z3-new-group-creation-5vc.md)

Notes: A new empty group opens to the right and becomes active.

### User drags tab group to new position

Status: Proven

Evidence: [E](../tests/fixtures/event-analyzer/scenarios/05-e-group-swap.md), [L](../tests/fixtures/event-analyzer/scenarios/12-l-3-column-group-move.md), [M](../tests/fixtures/event-analyzer/scenarios/13-m-4-col-move-vc1-vc4.md)

Notes: Group view columns renumber as groups move across the strip.

### User drags tab group to other existing tab group, thus merging the two tab groups

Status: Proven

Evidence: [AM1](../tests/fixtures/event-analyzer/scenarios/74-am1-join-two-groups-2vc.md), [AM2](../tests/fixtures/event-analyzer/scenarios/75-am2-join-two-groups-3vc-middle-right.md), [AM3](../tests/fixtures/event-analyzer/scenarios/76-am3-join-two-groups-4vc-rightmost-duplicate.md), [AD1](../tests/fixtures/event-analyzer/scenarios/50-ad1-join-all-groups-2vc.md), [AD2](../tests/fixtures/event-analyzer/scenarios/51-ad2-join-all-groups-3vc.md), [AD3](../tests/fixtures/event-analyzer/scenarios/52-ad3-join-all-groups-5vc-duplicate.md)

Notes: `workbench.action.joinTwoGroups` now provides targeted merge coverage across distinct two-group and three-group layouts plus a duplicate-containing rightmost-to-left merge. The source group closes, the target group absorbs the source tabs, and duplicate editors evaporate instead of surviving as second copies. The earlier `joinAllGroups` captures remain useful as a broader approximation family.

### User closes tab group with multiple tabs, thus closing all tabs within the group

Status: Proven

Evidence: [Y2](../tests/fixtures/event-analyzer/scenarios/36-y2-close-group-3vc-2-tabs.md), [Y3](../tests/fixtures/event-analyzer/scenarios/37-y3-close-group-5vc-3-tabs.md)

Notes: The group closes, all contained tabs close, active-group reassignment is captured, and groups to the right renumber left.