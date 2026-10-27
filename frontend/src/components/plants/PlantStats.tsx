"use client";

import { StatCard, LeafIcon, ChartIcon, DropletIcon, ShieldIcon } from "@/components/shared";
import type { Plant } from "@/services/plantService";

export default function PlantStats({ plants }: { plants: Plant[] }) {
  const total = plants.length;
  const healthy = plants.filter((p) => p.current_status.severity < 30).length;
  const critical = plants.filter((p) => p.current_status.severity >= 70).length;
  const pesticide = plants.reduce(
    (sum, p) => sum + (p.total_pesticide_used_ml || 0),
    0
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        value={total}
        label="Plants Tracked"
        icon={<LeafIcon className="w-6 h-6" />}
      />
      <StatCard
        value={healthy}
        label="Healthy"
        icon={<ShieldIcon className="w-6 h-6" />}
      />
      <StatCard
        value={critical}
        label="Needs Attention"
        icon={<ChartIcon className="w-6 h-6" />}
      />
      <StatCard
        value={`${Math.round(pesticide)} ml`}
        label="Pesticide Used"
        icon={<DropletIcon className="w-6 h-6" />}
      />
    </div>
  );
}
