"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Container,
  SectionHeader,
  Card,
  Badge,
  ProgressBar,
  Button,
  ChevronRightIcon,
} from "@/components/shared";
import { usePlants } from "@/hooks/usePlants";
import { getTrend } from "@/lib/trendConfig";
import { prettifyEnum } from "@/lib/format";

export default function PlantProfilePreview() {
  const { plants, isLoading, fetchAll } = usePlants();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const plant = plants[0];

  return (
    <section className="py-20 bg-earth-50">
      <Container>
        <SectionHeader
          title="Plant Health Profile"
          subtitle="Track every plant's health, history, and treatment decisions in one place"
        />

        {isLoading ? (
          <Card className="max-w-lg mx-auto text-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-primary-100 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-primary-100 rounded w-1/2 mx-auto" />
              <div className="h-24 bg-primary-100 rounded" />
            </div>
          </Card>
        ) : plant ? (
          <Card className="max-w-lg mx-auto" hover>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  {plant.label || plant.plant_id}
                </h3>
                <p className="text-sm text-text-muted capitalize">
                  {plant.crop_type}
                </p>
              </div>
              <Badge
                variant={
                  plant.current_status.severity < 30
                    ? "healthy"
                    : plant.current_status.severity < 70
                      ? "warning"
                      : "critical"
                }
              >
                {prettifyEnum(plant.current_status.diagnosis)}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">Health Score</span>
                  <span className="font-medium text-text-primary">
                    {100 - plant.current_status.severity}%
                  </span>
                </div>
                <ProgressBar
                  value={100 - plant.current_status.severity}
                  variant="health"
                  showLabel={false}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">Severity</span>
                  <span className="font-medium text-text-primary">
                    {plant.current_status.severity}%
                  </span>
                </div>
                <ProgressBar
                  value={plant.current_status.severity}
                  variant="severity"
                  showLabel={false}
                />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary">Trend:</span>
                {(() => {
                  const trend = getTrend(plant.current_status.trend);
                  const Icon = trend.icon;
                  return (
                    <span className={`flex items-center gap-1 font-medium ${trend.color}`}>
                      <Icon className="w-4 h-4" />
                      {trend.label}
                    </span>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-primary-50 rounded-[var(--radius-md)]">
                  <div className="text-xs text-text-muted">Pesticide Used</div>
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

            <Link href={`/plants/${plant.plant_id}`} className="mt-6 block">
              <Button variant="outline" className="w-full">
                View Full Profile
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="max-w-lg mx-auto text-center py-12">
            <p className="text-text-muted">
              No plants registered yet. Upload a plant photo above to get started.
            </p>
            <p className="mt-2 text-xs text-text-muted font-mono">
              POST /api/scan
            </p>
          </Card>
        )}
      </Container>
    </section>
  );
}
