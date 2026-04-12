export function calculateColumnDropIndex(
  draggedColumn: number | null,
  dropTarget: number | null,
  dropMode: 'reorder' | 'merge' | null,
  orderedViewColumns: number[]
): number | null {
  if (
    draggedColumn == null ||
    dropTarget == null ||
    dropMode !== 'reorder'
  ) {
    return null;
  }

  const draggedIndex = orderedViewColumns.indexOf(draggedColumn);
  const dropTargetIndex = orderedViewColumns.indexOf(dropTarget);

  if (draggedIndex === -1 || dropTargetIndex === -1) {
    return null;
  }

  if (draggedIndex === dropTargetIndex) {
    return null;
  }

  return dropTargetIndex + (draggedIndex < dropTargetIndex ? 1 : 0);
}