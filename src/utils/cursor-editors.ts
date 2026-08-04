import * as os from 'os';
import * as path from 'path';
import { Uri, workspace } from 'vscode';

/** Cursor built-in plan editor (workbench.editor.markdownPlan). */
export const CURSOR_PLAN_EDITOR_ID = 'workbench.editor.markdownPlan';

/** Cursor built-in canvas editor. */
export const CURSOR_CANVAS_EDITOR_ID = 'workbench.editor.canvas';

export const CURSOR_PLAN_SCHEME = 'cursor-plan';
export const CURSOR_CANVAS_SCHEME = 'cursor-canvas';

export function isPlanUri(uriString: string | undefined): boolean {
  if (!uriString) {
    return false;
  }
  try {
    const uri = Uri.parse(uriString);
    const fileName = path.basename(uri.path).toLowerCase();
    if (fileName.endsWith('.plan.md')) {
      return true;
    }
    return uri.scheme === CURSOR_PLAN_SCHEME;
  } catch {
    return false;
  }
}

export function isCanvasUri(uriString: string | undefined): boolean {
  if (!uriString) {
    return false;
  }
  try {
    return Uri.parse(uriString).scheme === CURSOR_CANVAS_SCHEME;
  } catch {
    return false;
  }
}

export function isPlanViewType(viewType: string | undefined): boolean {
  if (!viewType) {
    return false;
  }
  return (
    viewType === CURSOR_PLAN_EDITOR_ID ||
    viewType === 'workbench.input.markdownPlan' ||
    viewType === 'markdownPlanEditor'
  );
}

export function isCanvasViewType(viewType: string | undefined): boolean {
  if (!viewType) {
    return false;
  }
  return (
    viewType === CURSOR_CANVAS_EDITOR_ID ||
    viewType === 'workbench.input.canvas'
  );
}

/**
 * Prefer a file-backed URI for plan restore. Virtual `cursor-plan:` tabs are not
 * serialized by Cursor itself; best-effort resolve to ~/.cursor/plans or workspace.
 */
export async function resolvePlanOpenUri(
  uriString: string
): Promise<Uri | null> {
  let uri: Uri;
  try {
    uri = Uri.parse(uriString);
  } catch {
    return null;
  }

  if (uri.scheme === 'file' || uri.scheme === 'vscode-userdata') {
    return uri;
  }

  if (uri.scheme !== CURSOR_PLAN_SCHEME) {
    return null;
  }

  const baseName = path.basename(uri.path);
  if (!baseName.toLowerCase().endsWith('.plan.md')) {
    return null;
  }

  const candidates: Uri[] = [];

  const globalPlans = path.join(os.homedir(), '.cursor', 'plans', baseName);
  candidates.push(Uri.file(globalPlans));

  for (const folder of workspace.workspaceFolders ?? []) {
    candidates.push(Uri.joinPath(folder.uri, '.cursor', 'plans', baseName));
    candidates.push(Uri.joinPath(folder.uri, baseName));
  }

  for (const candidate of candidates) {
    try {
      await workspace.fs.stat(candidate);
      return candidate;
    } catch {
      // try next
    }
  }

  return null;
}

export function inferCursorEditorViewType(options: {
  uri?: string;
  viewType?: string;
  label?: string;
}): string | undefined {
  if (isPlanViewType(options.viewType) || isPlanUri(options.uri)) {
    return CURSOR_PLAN_EDITOR_ID;
  }
  if (isCanvasViewType(options.viewType) || isCanvasUri(options.uri)) {
    return CURSOR_CANVAS_EDITOR_ID;
  }
  // Label-only heuristic for plan files opened without a parseable uri on input
  if (options.label?.toLowerCase().endsWith('.plan.md')) {
    return CURSOR_PLAN_EDITOR_ID;
  }
  return undefined;
}
