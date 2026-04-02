/**
 * Calculate the final drop index after accounting for index shifts
 * when moving within the same column.
 *
 * When moving an item within the same column, removing the source item
 * shifts all subsequent indices down by one. If the source index is
 * before the raw drop index, we subtract one to compensate.
 *
 * Returns `null` when the move is a no-op (same position).
 */
export function calculateDropIndex(
  fromIndex: number,
  fromViewColumn: number,
  rawToIndex: number,
  toViewColumn: number
): number | null {
  let finalIndex = rawToIndex;

  if (fromViewColumn === toViewColumn && fromIndex < finalIndex) {
    finalIndex--;
  }

  if (fromIndex === finalIndex && fromViewColumn === toViewColumn) {
    return null;
  }

  return finalIndex;
}
