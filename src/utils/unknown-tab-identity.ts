import { Uri } from 'vscode';

export interface UnknownTabIdentity {
  uri?: string;
  viewType?: string;
}

function looksLikeUriString(value: string): boolean {
  return (
    value.startsWith('/') ||
    value.startsWith('file:') ||
    value.includes('://') ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)
  );
}

function asUriString(value: unknown): string | undefined {
  if (Uri.isUri?.(value) || value instanceof Uri) {
    return (value as Uri).toString();
  }
  if (typeof value === 'string' && value.length > 0 && looksLikeUriString(value)) {
    return value;
  }
  if (value && typeof value === 'object') {
    const record = value as {
      scheme?: string;
      path?: string;
      toString?: () => string;
    };
    if (typeof record.scheme === 'string' && typeof record.path === 'string') {
      try {
        return Uri.from({
          scheme: record.scheme,
          path: record.path,
          authority: (record as { authority?: string }).authority,
          query: (record as { query?: string }).query,
          fragment: (record as { fragment?: string }).fragment
        }).toString();
      } catch {
        const authority = (record as { authority?: string }).authority ?? '';
        return authority
          ? `${record.scheme}://${authority}${record.path}`
          : `${record.scheme}:${record.path}`;
      }
    }
    if (typeof record.toString === 'function') {
      const asString = String(record.toString());
      if (looksLikeUriString(asString)) {
        return asString;
      }
    }
  }
  return undefined;
}

/**
 * Duck-type unrecognized tab.input objects (e.g. Cursor built-in editors that
 * are not TabInputText/Custom/…). Prefer resource/uri and editor/view type ids.
 */
export function extractUnknownTabIdentity(input: unknown): UnknownTabIdentity {
  if (input == null || typeof input !== 'object') {
    return {};
  }

  const record = input as Record<string, unknown>;
  const uri =
    asUriString(record.uri) ??
    asUriString(record.resource) ??
    asUriString(record.modified) ??
    asUriString(record.original);

  const viewTypeCandidate =
    record.viewType ??
    record.editorId ??
    record.typeId ??
    (typeof record.get === 'function' ? undefined : undefined);

  let viewType: string | undefined;
  if (typeof viewTypeCandidate === 'string' && viewTypeCandidate.length > 0) {
    viewType = viewTypeCandidate;
  } else {
    // Some EditorInput subclasses expose static TypeID/EditorID on the constructor.
    const ctor = (input as { constructor?: { EditorID?: string; TypeID?: string } }).constructor;
    if (typeof ctor?.EditorID === 'string' && ctor.EditorID.length > 0) {
      viewType = ctor.EditorID;
    } else if (typeof ctor?.TypeID === 'string' && ctor.TypeID.length > 0) {
      viewType = ctor.TypeID;
    }
  }

  return { uri, viewType };
}
