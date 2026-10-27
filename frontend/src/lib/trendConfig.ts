import { TrendUpIcon, TrendDownIcon, MinusIcon } from "@/components/shared/icons";

export const TREND_TOLERANCE = 5;

export const trendConfig = {
  improving: { icon: TrendUpIcon, label: "Improving", color: "text-primary-600" },
  worsening: { icon: TrendDownIcon, label: "Worsening", color: "text-red-500" },
  stable: { icon: MinusIcon, label: "Stable", color: "text-secondary-600" },
};

export function getTrend(trend?: string) {
  if (trend === "improving" || trend === "worsening" || trend === "stable") {
    return trendConfig[trend];
  }
  return trendConfig.stable;
}

export function describeTrend(trend?: string, delta?: number): string {
  if (delta === undefined || delta === null) {
    return "";
  }
  if (trend === "worsening") {
    return `+${delta}% vs last scan`;
  }
  if (trend === "improving") {
    return `${delta}% vs last scan`;
  }
  return `Steady (±${TREND_TOLERANCE}%)`;
}
