"use client";

import { Card, Badge, ProgressBar } from "@/components/shared";
import { getTrend, describeTrend } from "@/lib/trendConfig";
import { prettifyEnum } from "@/lib/format";
import type { Plant } from "@/services/plantService";

export default function HealthProfile({
  plant,
  latestImage,
}: {
  plant: Plant;
  latestImage?: string;
}) {
  const { current_status } = plant;
  const trend = getTrend(current_status.trend);
  const TrendIcon = trend.icon;

  return (
    <Card>
      {latestImage && (
        <div className="mb-5 rounded-[var(--radius-md)] overflow-hidden border border-primary-100">
          <img
            src={latestImage}
            alt={`${plant.plant_id} latest scan`}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            {plant.label || plant.plant_id}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-text-muted capitalize">{plant.crop_type}</p>
            {plant.label && plant.label !== plant.plant_id && (
              <span className="text-xs text-text-muted font-mono">
                {plant.plant_id}
              </span>
            )}
            {plant.auto_registered && (
              <Badge variant="info">Auto-registered</Badge>
            )}
          </div>
        </div>
        <Badge
          variant={
            current_status.severity < 30
              ? "healthy"
              : current_status.severity < 70
                ? "warning"
                : "critical"
          }
        >
          {prettifyEnum(current_status.diagnosis)}
        </Badge>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary">Health Score</span>
            <span className="font-bold text-lg text-primary-700">
              {100 - current_status.severity}%
            </span>
          </div>
          <ProgressBar
            value={100 - current_status.severity}
            variant="health"
            showLabel={false}
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary">Disease Severity</span>
            <span className="font-bold text-lg text-text-primary">
              {current_status.severity}%
            </span>
          </div>
          <ProgressBar
            value={current_status.severity}
            variant="severity"
            showLabel={false}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-primary-50 rounded-[var(--radius-md)] text-center">
            <div className="text-xs text-text-muted">Trend</div>
            <div className={`flex items-center justify-center gap-1 mt-1 font-semibold ${trend.color}`}>
              <TrendIcon className="w-4 h-4" />
              {trend.label}
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">
              {describeTrend(current_status.trend, current_status.trend_delta)}
            </div>
          </div>
          <div className="p-3 bg-primary-50 rounded-[var(--radius-md)] text-center">
            <div className="text-xs text-text-muted">Position</div>
            <div className="mt-1 font-bold text-text-primary">
              R{plant.position.row} C{plant.position.col}
            </div>
          </div>
          <div className="p-3 bg-primary-50 rounded-[var(--radius-md)] text-center">
            <div className="text-xs text-text-muted">Pesticide Used</div>
            <div className="mt-1 font-bold text-text-primary">
              {plant.total_pesticide_used_ml} ml
            </div>
          </div>
          <div className="p-3 bg-primary-50 rounded-[var(--radius-md)] text-center">
            <div className="text-xs text-text-muted">Last Updated</div>
            <div className="mt-1 font-bold text-text-primary text-sm">
              {current_status.last_updated
                ? new Date(current_status.last_updated).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
