"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/shared";
import { prettifyEnum, prettifyReason } from "@/lib/format";
import { ACTION_META } from "@/lib/decisionConfig";
import type { DailyLog } from "@/services/plantService";

export default function HistoryTimeline({ logs }: { logs: DailyLog[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (logs.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-text-muted">No scan history yet.</p>
      </Card>
    );
  }

  return (
    <Card padding="sm">
      <h3 className="text-lg font-bold text-text-primary p-4 pb-2">Scan History</h3>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-100" />

        {logs.map((log) => (
          <div
            key={log._id}
            className="relative pl-16 py-4 px-4 cursor-pointer hover:bg-primary-50/50 transition-colors"
            onClick={() => setExpanded(expanded === log._id ? null : log._id)}
          >
            <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-primary-500 border-2 border-white shadow-sm" />

            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-text-primary">
                  {new Date(log.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-text-muted mt-0.5 capitalize">
                  {log.diagnosis ? prettifyEnum(log.diagnosis) : "No diagnosis"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {log.action && (
                  <Badge
                    variant={
                      log.action === "spray_urgent"
                        ? "critical"
                        : log.action === "spray" || log.action === "alert_only"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {prettifyEnum(log.action)}
                  </Badge>
                )}
                {log.severity_score !== undefined && (
                  <Badge
                    variant={
                      log.severity_score < 30
                        ? "healthy"
                        : log.severity_score < 70
                          ? "warning"
                          : "critical"
                    }
                  >
                    {log.severity_score}% severity
                  </Badge>
                )}
              </div>
            </div>

            {expanded === log._id && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {log.disease_percent !== undefined && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Disease</span>
                      <div className="font-semibold">{log.disease_percent}%</div>
                    </div>
                  )}
                  {log.env_data?.temp !== undefined && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Temp</span>
                      <div className="font-semibold">{log.env_data.temp}°C</div>
                    </div>
                  )}
                  {log.env_data?.humidity !== undefined && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Humidity</span>
                      <div className="font-semibold">{log.env_data.humidity}%</div>
                    </div>
                  )}
                  {log.env_data?.soil_moisture !== undefined && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Moisture</span>
                      <div className="font-semibold">{log.env_data.soil_moisture}%</div>
                    </div>
                  )}
                  {log.env_data?.soil !== undefined && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Soil</span>
                      <div className="font-semibold">{log.env_data.soil}</div>
                    </div>
                  )}
                  {log.env_risk && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Env Risk</span>
                      <div className="font-semibold capitalize">
                        {prettifyEnum(log.env_risk)}
                      </div>
                    </div>
                  )}
                  {log.camera_risk && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Camera Risk</span>
                      <div className="font-semibold capitalize">{log.camera_risk}</div>
                    </div>
                  )}
                  {log.should_spray !== undefined && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Spray</span>
                      <div className="font-semibold">
                        {log.should_spray ? "Yes" : "No"}
                      </div>
                    </div>
                  )}
                  {log.recommended_pesticide && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Pesticide</span>
                      <div className="font-semibold">{log.recommended_pesticide}</div>
                    </div>
                  )}
                  {log.recommended_dosage_ml !== undefined && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Dosage</span>
                      <div className="font-semibold">{log.recommended_dosage_ml} ml</div>
                    </div>
                  )}
                  {log.ocr_confidence !== undefined && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">OCR</span>
                      <div className="font-semibold">{log.ocr_confidence}%</div>
                    </div>
                  )}
                  {log.cohort_verdict && (
                    <div className="p-2 bg-earth-50 rounded">
                      <span className="text-text-muted">Cohort</span>
                      <div className="font-semibold capitalize">{log.cohort_verdict}</div>
                    </div>
                  )}
                </div>

                {(log.action || log.decision_message) && (
                  <div
                    className={`p-3 rounded-[var(--radius-md)] border ${
                      ACTION_META[log.action ?? "no_action"].box
                    }`}
                  >
                    <div className="text-xs font-semibold text-text-primary">
                      {log.decision_message ??
                        (log.action
                          ? `${ACTION_META[log.action].label}${
                              log.recommended_pesticide
                                ? ` · ${log.recommended_pesticide}${
                                    log.recommended_dosage_ml !== undefined
                                      ? ` (${log.recommended_dosage_ml} ml)`
                                      : ""
                                  }`
                                : ""
                            }`
                          : "")}
                    </div>
                    {log.decision_reason && (
                      <div className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                        {prettifyReason(log.decision_reason)}
                      </div>
                    )}
                  </div>
                )}

                {log.image_url && (
                  <div className="rounded-[var(--radius-md)] overflow-hidden border border-primary-100">
                    <img
                      src={log.image_url}
                      alt={`Scan on ${new Date(log.date).toLocaleDateString()}`}
                      className="w-full max-h-56 object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
