"use client";

import Link from "next/link";
import { Card, Badge, ProgressBar, ChevronRightIcon } from "@/components/shared";
import { getTrend, describeTrend } from "@/lib/trendConfig";
import { prettifyEnum } from "@/lib/format";
import type { Plant } from "@/services/plantService";

export default function PlantCard({ plant }: { plant: Plant }) {
  const { current_status } = plant;
  const trend = getTrend(current_status.trend);
  const TrendIcon = trend.icon;
  const health = 100 - current_status.severity;

  return (
    <Link href={`/plants/${plant.plant_id}`} className="block group">
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-700">
              {plant.label || plant.plant_id}
            </h3>
            <p className="text-sm text-text-muted capitalize">
              {plant.crop_type}
              {plant.label && plant.label !== plant.plant_id
                ? ` · ${plant.plant_id}`
                : ""}
            </p>
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

        {plant.auto_registered && (
          <Badge variant="info" className="mb-3">
            Auto-registered
          </Badge>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">Health Score</span>
              <span className="font-medium text-text-primary">{health}%</span>
            </div>
            <ProgressBar value={health} variant="health" showLabel={false} />
          </div>

          <div className="text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Trend</span>
              <span className={`flex items-center gap-1 font-medium ${trend.color}`}>
                <TrendIcon className="w-4 h-4" />
                {trend.label}
              </span>
            </div>
            <div className="text-[11px] text-text-muted mt-0.5 text-right">
              {describeTrend(current_status.trend, current_status.trend_delta)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="text-center p-3 bg-primary-50 rounded-[var(--radius-md)]">
              <div className="text-xs text-text-muted">Pesticide</div>
              <div className="font-bold text-primary-800">
                {plant.total_pesticide_used_ml} ml
              </div>
            </div>
            <div className="text-center p-3 bg-primary-50 rounded-[var(--radius-md)]">
              <div className="text-xs text-text-muted">Position</div>
              <div className="font-bold text-primary-800">
                R{plant.position.row}C{plant.position.col}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-1 text-sm text-primary-600 font-medium">
          View history
          <ChevronRightIcon className="w-4 h-4" />
        </div>
      </Card>
    </Link>
  );
}
