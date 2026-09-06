const POINT_DECIMAL_FACTOR = 10;
const FLOATING_POINT_TOLERANCE = 1e-8;

export function floorPointToOneDecimal(value: number): number {
  if (!Number.isFinite(value)) return 0;

  return (
    Math.floor((value + FLOATING_POINT_TOLERANCE) * POINT_DECIMAL_FACTOR) /
    POINT_DECIMAL_FACTOR
  );
}

export function formatPoint(value: number): string {
  return floorPointToOneDecimal(value).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
