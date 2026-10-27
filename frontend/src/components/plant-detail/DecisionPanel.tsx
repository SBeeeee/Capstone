"use client";

import { Card, Badge } from "@/components/shared";
import { prettifyEnum, prettifyReason } from "@/lib/format";
import {
  ACTION_MATRIX,
  ACTION_META,
  CAMERA_RISK_LABEL,
  CAMERA_RISK_ORDER,
  DISEASE_THRESHOLDS,
  ENV_RISK_LABEL,
  ENV_RISK_ORDER,
  cameraRiskVariant,
  envRiskVariant,
} from "@/lib/decisionConfig";
import type { DailyLog } from "@/services/plantService";

function Meter({
  label,
  value,
  unit,
  domain,
  band,
  ok,
}: {
  label: string;
  value: number;
  unit: string;
  domain: [number, number];
  band: [number, number];
  ok: boolean;
}) {
  const toPct = (v: number) =>
    Math.min(100, Math.max(0, ((v - domain[0]) / (domain[1] - domain[0])) * 100));
  const left = toPct(band[0]);
  const width = Math.max(2, toPct(band[1]) - left);

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-text-secondary">{label}</span>
        <span className={ok ? "font-semibold text-primary-700" : "font-semibold text-red-600"}>
          {value}
          {unit} {ok ? "✓" : "✗"}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-earth-100">
        <div
          className="absolute h-full rounded-full bg-primary-200"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3.5 rounded-full bg-text-primary shadow"
          style={{ left: `calc(${toPct(value)}% - 3px)` }}
        />
      </div>
    </div>
  );
}

export default function DecisionPanel({ logs }: { logs: DailyLog[] }) {
  if (logs.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-text-muted">No decision yet — scan this plant.</p>
      </Card>
    );
  }

  const latest = logs[0];
  const action = latest.action ?? "no_action";
  const meta = ACTION_META[action];
  const envRisk = latest.env_risk ?? "not_favourable";
  const cameraRisk = latest.camera_risk ?? "none";
  const threshold = latest.diagnosis ? DISEASE_THRESHOLDS[latest.diagnosis] : undefined;
  const env = latest.env_data ?? {};

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Latest Decision</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {new Date(latest.date).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge variant={meta.variant}>{meta.label}</Badge>
      </div>

      <div className={`p-3 rounded-[var(--radius-md)] border mb-5 ${meta.box}`}>
        <div className="font-semibold text-text-primary">
          {prettifyEnum(latest.diagnosis || "unknown")}
        </div>
        <div className="text-sm text-text-secondary mt-0.5">
          {latest.decision_message ?? meta.description}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Signal fusion
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex flex-col items-center">
              <Badge variant={envRiskVariant[envRisk]}>
                {ENV_RISK_LABEL[envRisk]}
              </Badge>
              <span className="text-[10px] text-text-muted mt-1">Environment</span>
            </div>
            <span className="text-text-muted">+</span>
            <div className="flex flex-col items-center">
              <Badge variant={cameraRiskVariant[cameraRisk]}>
                {CAMERA_RISK_LABEL[cameraRisk]}
              </Badge>
              <span className="text-[10px] text-text-muted mt-1">Camera</span>
            </div>
            <span className="text-text-muted">→</span>
            <div className="flex flex-col items-center">
              <Badge variant={meta.variant}>{meta.label}</Badge>
              <span className="text-[10px] text-text-muted mt-1">Action</span>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-xs border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-left text-text-muted font-medium">Env \ Cam</th>
                  {CAMERA_RISK_ORDER.map((cam) => (
                    <th key={cam} className="text-center text-text-muted font-medium px-1">
                      {CAMERA_RISK_LABEL[cam]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENV_RISK_ORDER.map((envRow) => (
                  <tr key={envRow}>
                    <td className="text-text-muted whitespace-nowrap pr-2">
                      {ENV_RISK_LABEL[envRow]}
                    </td>
                    {CAMERA_RISK_ORDER.map((cam) => {
                      const cell = ACTION_MATRIX[envRow][cam];
                      const active = envRow === envRisk && cam === cameraRisk;
                      return (
                        <td
                          key={cam}
                          className={`text-center rounded-[var(--radius-sm)] py-1.5 px-1 font-medium ${
                            active
                              ? `${ACTION_META[cell].box} ring-1 ring-primary-400 border`
                              : "bg-earth-50 text-text-muted"
                          }`}
                        >
                          {ACTION_META[cell].short}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Reading vs thresholds
          </div>
          {threshold ? (
            <div className="space-y-4">
              {env.temp !== undefined && (
                <Meter
                  label="Temperature"
                  value={env.temp}
                  unit="°C"
                  domain={[0, 45]}
                  band={[threshold.temp.min, threshold.temp.max]}
                  ok={env.temp >= threshold.temp.min && env.temp <= threshold.temp.max}
                />
              )}
              {env.humidity !== undefined && (
                <Meter
                  label="Humidity"
                  value={env.humidity}
                  unit="%"
                  domain={[0, 100]}
                  band={[threshold.humidity.min, 100]}
                  ok={env.humidity >= threshold.humidity.min}
                />
              )}
              {env.soil_moisture !== undefined && (
                <Meter
                  label="Soil moisture"
                  value={env.soil_moisture}
                  unit="%"
                  domain={[0, 100]}
                  band={[threshold.soil_moisture.min, 100]}
                  ok={env.soil_moisture >= threshold.soil_moisture.min}
                />
              )}
              {env.temp === undefined &&
                env.humidity === undefined &&
                env.soil_moisture === undefined && (
                  <p className="text-sm text-text-muted">
                    No sensor readings on this scan.
                  </p>
                )}
              <p className="text-[11px] text-text-muted pt-1">
                Green band = threshold range for {prettifyEnum(latest.diagnosis)} ·
                marker = your reading
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              No threshold rule for this condition.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-primary-50">
        <div className="p-3 bg-earth-50 rounded-[var(--radius-md)]">
          <div className="text-xs text-text-muted">Pesticide</div>
          <div className="font-semibold text-text-primary">
            {latest.recommended_pesticide || "—"}
          </div>
        </div>
        <div className="p-3 bg-earth-50 rounded-[var(--radius-md)]">
          <div className="text-xs text-text-muted">Dosage</div>
          <div className="font-semibold text-text-primary">
            {latest.recommended_dosage_ml ?? 0} ml
          </div>
        </div>
        <div className="p-3 bg-earth-50 rounded-[var(--radius-md)]">
          <div className="text-xs text-text-muted">Spray</div>
          <div className="font-semibold text-text-primary">
            {latest.should_spray ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {latest.decision_reason && (
        <p className="mt-4 text-xs text-text-secondary bg-primary-50/60 rounded-[var(--radius-md)] p-3 leading-relaxed">
          {prettifyReason(latest.decision_reason)}
        </p>
      )}
    </Card>
  );
}
