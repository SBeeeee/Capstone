export type Trend = "improving" | "worsening" | "stable";

export const TREND_TOLERANCE = 5;

export interface TrendResult {
  trend: Trend;
  delta: number;
}

export const computeTrend = (
  currentSeverity: number,
  previousSeverity?: number | null
): TrendResult => {
  if (previousSeverity === undefined || previousSeverity === null) {
    return { trend: "stable", delta: 0 };
  }

  const delta = currentSeverity - previousSeverity;

  if (delta > TREND_TOLERANCE) {
    return { trend: "worsening", delta };
  }
  if (delta < -TREND_TOLERANCE) {
    return { trend: "improving", delta };
  }
  return { trend: "stable", delta };
};
