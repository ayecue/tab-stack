# VS Code Event Capture Index

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0
Output version: 2
Scenarios: 80

| # | Scenario | JSON | Markdown | Observed Events | Tab Events | Group Events | Initial v | Final v |
|---|----------|------|----------|-----------------|------------|--------------|-----------|---------|
| 1 | A: open a single file | scenarios/01-a-open-a-single-file.json | scenarios/01-a-open-a-single-file.md | 3 | 2 | 1 | 0 | 3 |
| 2 | B: close a single tab | scenarios/02-b-close-a-single-tab.json | scenarios/02-b-close-a-single-tab.md | 2 | 1 | 1 | 0 | 2 |
| 3 | C: move tab cross-column | scenarios/03-c-move-tab-cross-column.json | scenarios/03-c-move-tab-cross-column.md | 7 | 4 | 3 | 0 | 7 |
| 4 | D: reorder within group | scenarios/04-d-reorder-within-group.json | scenarios/04-d-reorder-within-group.md | 1 | 1 | 0 | 0 | 1 |
| 5 | E: group swap | scenarios/05-e-group-swap.json | scenarios/05-e-group-swap.md | 2 | 0 | 2 | 0 | 2 |
| 6 | F: pin a tab | scenarios/06-f-pin-a-tab.json | scenarios/06-f-pin-a-tab.md | 1 | 1 | 0 | 0 | 1 |
| 7 | G: dirty a tab | scenarios/07-g-dirty-a-tab.json | scenarios/07-g-dirty-a-tab.md | 1 | 1 | 0 | 0 | 1 |
| 8 | H: activate different tab | scenarios/08-h-activate-different-tab.json | scenarios/08-h-activate-different-tab.md | 2 | 1 | 1 | 0 | 2 |
| 9 | I: duplicate in another column | scenarios/09-i-duplicate-in-another-column.json | scenarios/09-i-duplicate-in-another-column.md | 4 | 2 | 2 | 0 | 4 |
| 10 | J: close last in group | scenarios/10-j-close-last-in-group.json | scenarios/10-j-close-last-in-group.md | 4 | 1 | 3 | 0 | 4 |
| 11 | K: multi-step reorder | scenarios/11-k-multi-step-reorder.json | scenarios/11-k-multi-step-reorder.md | 3 | 3 | 0 | 0 | 3 |
| 12 | L: 3-column group move | scenarios/12-l-3-column-group-move.json | scenarios/12-l-3-column-group-move.md | 2 | 0 | 2 | 0 | 2 |
| 13 | M: 4-col move vc1→vc4 | scenarios/13-m-4-col-move-vc1-vc4.json | scenarios/13-m-4-col-move-vc1-vc4.md | 6 | 0 | 6 | 0 | 6 |
| 14 | N: multi-hop tab move | scenarios/14-n-multi-hop-tab-move.json | scenarios/14-n-multi-hop-tab-move.md | 14 | 8 | 6 | 0 | 14 |
| 15 | O: group swap + close | scenarios/15-o-group-swap-close.json | scenarios/15-o-group-swap-close.md | 6 | 1 | 5 | 0 | 6 |
| 16 | P: group move + reorder | scenarios/16-p-group-move-reorder.json | scenarios/16-p-group-move-reorder.md | 3 | 1 | 2 | 0 | 3 |
| 17 | Q: close middle group | scenarios/17-q-close-middle-group.json | scenarios/17-q-close-middle-group.md | 6 | 2 | 4 | 0 | 6 |
| 18 | R: split editor | scenarios/18-r-split-editor.json | scenarios/18-r-split-editor.md | 5 | 2 | 3 | 0 | 5 |
| 19 | S: cross-group with index | scenarios/19-s-cross-group-with-index.json | scenarios/19-s-cross-group-with-index.md | 8 | 3 | 5 | 0 | 8 |
| 20 | T1: close other tabs (1vc) | scenarios/20-t1-close-other-tabs-1vc.json | scenarios/20-t1-close-other-tabs-1vc.md | 3 | 3 | 0 | 0 | 3 |
| 21 | T2: close other tabs (2vc) | scenarios/21-t2-close-other-tabs-2vc.json | scenarios/21-t2-close-other-tabs-2vc.md | 3 | 3 | 0 | 0 | 3 |
| 22 | T3: close other tabs (4vc) | scenarios/22-t3-close-other-tabs-4vc.json | scenarios/22-t3-close-other-tabs-4vc.md | 2 | 2 | 0 | 0 | 2 |
| 23 | U1: move tab to new group (1vc) | scenarios/23-u1-move-tab-to-new-group-1vc.json | scenarios/23-u1-move-tab-to-new-group-1vc.md | 8 | 4 | 4 | 0 | 8 |
| 24 | U2: move tab to new group (3vc) | scenarios/24-u2-move-tab-to-new-group-3vc.json | scenarios/24-u2-move-tab-to-new-group-3vc.md | 8 | 4 | 4 | 0 | 8 |
| 25 | U3: move tab to new group (5vc) | scenarios/25-u3-move-tab-to-new-group-5vc.json | scenarios/25-u3-move-tab-to-new-group-5vc.md | 8 | 4 | 4 | 0 | 8 |
| 26 | V1: dirty then save (1vc) | scenarios/26-v1-dirty-then-save-1vc.json | scenarios/26-v1-dirty-then-save-1vc.md | 2 | 2 | 0 | 0 | 2 |
| 27 | V2: dirty then save (2vc) | scenarios/27-v2-dirty-then-save-2vc.json | scenarios/27-v2-dirty-then-save-2vc.md | 2 | 2 | 0 | 0 | 2 |
| 28 | V3: dirty then save (4vc) | scenarios/28-v3-dirty-then-save-4vc.json | scenarios/28-v3-dirty-then-save-4vc.md | 2 | 2 | 0 | 0 | 2 |
| 29 | W1: pin then unpin (1vc) | scenarios/29-w1-pin-then-unpin-1vc.json | scenarios/29-w1-pin-then-unpin-1vc.md | 2 | 2 | 0 | 0 | 2 |
| 30 | W2: pin then unpin (1vc-many) | scenarios/30-w2-pin-then-unpin-1vc-many.json | scenarios/30-w2-pin-then-unpin-1vc-many.md | 3 | 3 | 0 | 0 | 3 |
| 31 | W3: pin then unpin (3vc) | scenarios/31-w3-pin-then-unpin-3vc.json | scenarios/31-w3-pin-then-unpin-3vc.md | 3 | 3 | 0 | 0 | 3 |
| 32 | X1: group activation (2vc) | scenarios/32-x1-group-activation-2vc.json | scenarios/32-x1-group-activation-2vc.md | 1 | 0 | 1 | 0 | 1 |
| 33 | X2: group activation (3vc) | scenarios/33-x2-group-activation-3vc.json | scenarios/33-x2-group-activation-3vc.md | 2 | 0 | 2 | 0 | 2 |
| 34 | X3: group activation (5vc) | scenarios/34-x3-group-activation-5vc.json | scenarios/34-x3-group-activation-5vc.md | 1 | 0 | 1 | 0 | 1 |
| 35 | Y1: close group (2vc, 1 tab) | scenarios/35-y1-close-group-2vc-1-tab.json | scenarios/35-y1-close-group-2vc-1-tab.md | 4 | 1 | 3 | 0 | 4 |
| 36 | Y2: close group (3vc, 2 tabs) | scenarios/36-y2-close-group-3vc-2-tabs.json | scenarios/36-y2-close-group-3vc-2-tabs.md | 6 | 2 | 4 | 0 | 6 |
| 37 | Y3: close group (5vc, 3 tabs) | scenarios/37-y3-close-group-5vc-3-tabs.json | scenarios/37-y3-close-group-5vc-3-tabs.md | 7 | 3 | 4 | 0 | 7 |
| 38 | Z1: new group creation (1vc) | scenarios/38-z1-new-group-creation-1vc.json | scenarios/38-z1-new-group-creation-1vc.md | 2 | 0 | 2 | 0 | 2 |
| 39 | Z2: new group creation (3vc) | scenarios/39-z2-new-group-creation-3vc.json | scenarios/39-z2-new-group-creation-3vc.md | 2 | 0 | 2 | 0 | 2 |
| 40 | Z3: new group creation (5vc) | scenarios/40-z3-new-group-creation-5vc.json | scenarios/40-z3-new-group-creation-5vc.md | 2 | 0 | 2 | 0 | 2 |
| 41 | AA1: duplicate-target move (2vc) | scenarios/41-aa1-duplicate-target-move-2vc.json | scenarios/41-aa1-duplicate-target-move-2vc.md | 6 | 3 | 3 | 0 | 6 |
| 42 | AA2: duplicate-target move (3vc) | scenarios/42-aa2-duplicate-target-move-3vc.json | scenarios/42-aa2-duplicate-target-move-3vc.md | 13 | 7 | 6 | 0 | 13 |
| 43 | AA3: duplicate-target move (5vc) | scenarios/43-aa3-duplicate-target-move-5vc.json | scenarios/43-aa3-duplicate-target-move-5vc.md | 13 | 7 | 6 | 0 | 13 |
| 44 | AB1: last-tab move-out (2vc) | scenarios/44-ab1-last-tab-move-out-2vc.json | scenarios/44-ab1-last-tab-move-out-2vc.md | 8 | 3 | 5 | 0 | 8 |
| 45 | AB2: last-tab move-out (3vc) | scenarios/45-ab2-last-tab-move-out-3vc.json | scenarios/45-ab2-last-tab-move-out-3vc.md | 8 | 3 | 5 | 0 | 8 |
| 46 | AB3: last-tab move-out (5vc) | scenarios/46-ab3-last-tab-move-out-5vc.json | scenarios/46-ab3-last-tab-move-out-5vc.md | 8 | 3 | 5 | 0 | 8 |
| 47 | AC1: last-tab duplicate-move (2vc) | scenarios/47-ac1-last-tab-duplicate-move-2vc.json | scenarios/47-ac1-last-tab-duplicate-move-2vc.md | 7 | 2 | 5 | 0 | 7 |
| 48 | AC2: last-tab duplicate-move (3vc) | scenarios/48-ac2-last-tab-duplicate-move-3vc.json | scenarios/48-ac2-last-tab-duplicate-move-3vc.md | 7 | 2 | 5 | 0 | 7 |
| 49 | AC3: last-tab duplicate-move (5vc) | scenarios/49-ac3-last-tab-duplicate-move-5vc.json | scenarios/49-ac3-last-tab-duplicate-move-5vc.md | 7 | 2 | 5 | 0 | 7 |
| 50 | AD1: join all groups (2vc) | scenarios/50-ad1-join-all-groups-2vc.json | scenarios/50-ad1-join-all-groups-2vc.md | 5 | 2 | 3 | 0 | 5 |
| 51 | AD2: join all groups (3vc) | scenarios/51-ad2-join-all-groups-3vc.json | scenarios/51-ad2-join-all-groups-3vc.md | 10 | 4 | 6 | 0 | 10 |
| 52 | AD3: join all groups (5vc-duplicate) | scenarios/52-ad3-join-all-groups-5vc-duplicate.json | scenarios/52-ad3-join-all-groups-5vc-duplicate.md | 29 | 12 | 17 | 0 | 29 |
| 53 | AE1: open file in active group (1vc, populated) | scenarios/53-ae1-open-file-in-active-group-1vc-populated.json | scenarios/53-ae1-open-file-in-active-group-1vc-populated.md | 3 | 2 | 1 | 0 | 3 |
| 54 | AE2: open file in active group (3vc, populated) | scenarios/54-ae2-open-file-in-active-group-3vc-populated.json | scenarios/54-ae2-open-file-in-active-group-3vc-populated.md | 3 | 2 | 1 | 0 | 3 |
| 55 | AE3: reopen same file in active group (1vc) | scenarios/55-ae3-reopen-same-file-in-active-group-1vc.json | scenarios/55-ae3-reopen-same-file-in-active-group-1vc.md | 2 | 1 | 1 | 0 | 2 |
| 56 | AF1: close single tab (1vc, populated) | scenarios/56-af1-close-single-tab-1vc-populated.json | scenarios/56-af1-close-single-tab-1vc-populated.md | 3 | 2 | 1 | 0 | 3 |
| 57 | AF2: close single tab (4vc, populated middle group) | scenarios/57-af2-close-single-tab-4vc-populated-middle-group.json | scenarios/57-af2-close-single-tab-4vc-populated-middle-group.md | 3 | 2 | 1 | 0 | 3 |
| 58 | AG1: split editor (1vc, populated) | scenarios/58-ag1-split-editor-1vc-populated.json | scenarios/58-ag1-split-editor-1vc-populated.md | 5 | 2 | 3 | 0 | 5 |
| 59 | AG2: split editor (3vc, middle group) | scenarios/59-ag2-split-editor-3vc-middle-group.json | scenarios/59-ag2-split-editor-3vc-middle-group.md | 7 | 2 | 5 | 0 | 7 |
| 60 | AH1: activate different tab (2vc, active group) | scenarios/60-ah1-activate-different-tab-2vc-active-group.json | scenarios/60-ah1-activate-different-tab-2vc-active-group.md | 2 | 1 | 1 | 0 | 2 |
| 61 | AH2: activate different tab (4vc, focused group) | scenarios/61-ah2-activate-different-tab-4vc-focused-group.json | scenarios/61-ah2-activate-different-tab-4vc-focused-group.md | 2 | 1 | 1 | 0 | 2 |
| 62 | AI1: preview promotion (1vc) | scenarios/62-ai1-preview-promotion-1vc.json | scenarios/62-ai1-preview-promotion-1vc.md | 1 | 1 | 0 | 0 | 1 |
| 63 | AI2: preview promotion (1vc, populated) | scenarios/63-ai2-preview-promotion-1vc-populated.json | scenarios/63-ai2-preview-promotion-1vc-populated.md | 1 | 1 | 0 | 0 | 1 |
| 64 | AI3: preview promotion (3vc, refocus) | scenarios/64-ai3-preview-promotion-3vc-refocus.json | scenarios/64-ai3-preview-promotion-3vc-refocus.md | 1 | 1 | 0 | 0 | 1 |
| 65 | AJ1: multi-tab cross-group approximation (2vc, 2 tabs) | scenarios/65-aj1-multi-tab-cross-group-approximation-2vc-2-tabs.json | scenarios/65-aj1-multi-tab-cross-group-approximation-2vc-2-tabs.md | 11 | 7 | 4 | 0 | 11 |
| 66 | AJ2: multi-tab cross-group approximation (3vc, 2 tabs) | scenarios/66-aj2-multi-tab-cross-group-approximation-3vc-2-tabs.json | scenarios/66-aj2-multi-tab-cross-group-approximation-3vc-2-tabs.md | 22 | 14 | 8 | 0 | 22 |
| 67 | AJ3: multi-tab cross-group approximation (5vc, 2 tabs) | scenarios/67-aj3-multi-tab-cross-group-approximation-5vc-2-tabs.json | scenarios/67-aj3-multi-tab-cross-group-approximation-5vc-2-tabs.md | 22 | 14 | 8 | 0 | 22 |
| 68 | AK1: multi-tab new-group approximation (1vc, 2 tabs) | scenarios/68-ak1-multi-tab-new-group-approximation-1vc-2-tabs.json | scenarios/68-ak1-multi-tab-new-group-approximation-1vc-2-tabs.md | 12 | 7 | 5 | 0 | 12 |
| 69 | AK2: multi-tab new-group approximation (3vc, 2 tabs) | scenarios/69-ak2-multi-tab-new-group-approximation-3vc-2-tabs.json | scenarios/69-ak2-multi-tab-new-group-approximation-3vc-2-tabs.md | 12 | 7 | 5 | 0 | 12 |
| 70 | AK3: multi-tab new-group approximation (5vc, 2 tabs) | scenarios/70-ak3-multi-tab-new-group-approximation-5vc-2-tabs.json | scenarios/70-ak3-multi-tab-new-group-approximation-5vc-2-tabs.md | 12 | 7 | 5 | 0 | 12 |
| 71 | AL1: multi-tab split approximation (1vc, 2 tabs) | scenarios/71-al1-multi-tab-split-approximation-1vc-2-tabs.json | scenarios/71-al1-multi-tab-split-approximation-1vc-2-tabs.md | 8 | 4 | 4 | 0 | 8 |
| 72 | AL2: multi-tab split approximation (3vc, 2 tabs) | scenarios/72-al2-multi-tab-split-approximation-3vc-2-tabs.json | scenarios/72-al2-multi-tab-split-approximation-3vc-2-tabs.md | 8 | 4 | 4 | 0 | 8 |
| 73 | AL3: multi-tab split approximation (5vc, 2 tabs) | scenarios/73-al3-multi-tab-split-approximation-5vc-2-tabs.json | scenarios/73-al3-multi-tab-split-approximation-5vc-2-tabs.md | 8 | 4 | 4 | 0 | 8 |
| 74 | AM1: join two groups (2vc) | scenarios/74-am1-join-two-groups-2vc.json | scenarios/74-am1-join-two-groups-2vc.md | 8 | 3 | 5 | 0 | 8 |
| 75 | AM2: join two groups (3vc-middle-right) | scenarios/75-am2-join-two-groups-3vc-middle-right.json | scenarios/75-am2-join-two-groups-3vc-middle-right.md | 10 | 5 | 5 | 0 | 10 |
| 76 | AM3: join two groups (4vc-rightmost-duplicate) | scenarios/76-am3-join-two-groups-4vc-rightmost-duplicate.json | scenarios/76-am3-join-two-groups-4vc-rightmost-duplicate.md | 9 | 5 | 4 | 0 | 9 |
| 77 | AN1: multi-tab same-group approximation (1vc-rightward-pair) | scenarios/77-an1-multi-tab-same-group-approximation-1vc-rightward-pair.json | scenarios/77-an1-multi-tab-same-group-approximation-1vc-rightward-pair.md | 6 | 4 | 2 | 0 | 6 |
| 78 | AN2: multi-tab same-group approximation (1vc-middle-triple-to-end) | scenarios/78-an2-multi-tab-same-group-approximation-1vc-middle-triple-to-end.json | scenarios/78-an2-multi-tab-same-group-approximation-1vc-middle-triple-to-end.md | 12 | 9 | 3 | 0 | 12 |
| 79 | AN3: multi-tab same-group approximation (1vc-late-pair-to-front) | scenarios/79-an3-multi-tab-same-group-approximation-1vc-late-pair-to-front.json | scenarios/79-an3-multi-tab-same-group-approximation-1vc-late-pair-to-front.md | 12 | 10 | 2 | 0 | 12 |
| 80 | AO: rightward multi-step reorder | scenarios/80-ao-rightward-multi-step-reorder.json | scenarios/80-ao-rightward-multi-step-reorder.md | 3 | 3 | 0 | 0 | 3 |
