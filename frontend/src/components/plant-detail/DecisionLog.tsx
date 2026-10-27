"use client";

import { Card, Badge } from "@/components/shared";
import { DropletIcon } from "@/components/shared/icons";
import type { SprayEvent } from "@/services/plantService";

export default function DecisionLog({ sprays }: { sprays: SprayEvent[] }) {
  if (sprays.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-text-muted">No spray events recorded yet.</p>
      </Card>
    );
  }

  return (
    <Card padding="sm">
      <h3 className="text-lg font-bold text-text-primary p-4 pb-2">Spray Decisions</h3>
      <div className="divide-y divide-primary-50">
        {sprays.map((spray) => (
          <div key={spray._id} className="flex items-start gap-4 p-4">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg shrink-0">
              <DropletIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {spray.pesticide_used}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {new Date(spray.spray_time).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <Badge
                  variant={
                    spray.status === "success"
                      ? "healthy"
                      : spray.status === "pending"
                        ? "warning"
                        : "critical"
                  }
                >
                  {spray.status}
                </Badge>
              </div>
              <div className="mt-2 flex gap-4 text-xs text-text-secondary">
                <span>Dosage: <strong>{spray.amount_ml} ml</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
