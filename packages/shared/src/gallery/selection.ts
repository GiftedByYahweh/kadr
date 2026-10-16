export interface SelectionSummary {
  selectedCount: number;
  includedCount: number;
  extraCount: number;
  extraPrice: number;
  extraTotal: number;
}

export function selectionSummary(
  includedCount: number,
  extraPrice: number,
  selectedCount: number,
): SelectionSummary {
  const extraCount = Math.max(0, selectedCount - includedCount);
  return {
    selectedCount,
    includedCount,
    extraCount,
    extraPrice,
    extraTotal: extraCount * extraPrice,
  };
}
