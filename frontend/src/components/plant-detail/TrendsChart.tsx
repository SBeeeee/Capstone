"use client";

import { Card } from "@/components/shared";
import type { DailyLog } from "@/services/plantService";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  severity: "#ef4444",
  disease: "#f59e0b",
  humidity: "#8b5cf6",
  temp: "#3b82f6",
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const units: Record<string, string> = {
    Severity: "%",
    Disease: "%",
    Humidity: "%",
    Temp: "°C",
  };

  return (
    <div className="bg-surface-card border border-primary-100 rounded-[var(--radius-md)] shadow-[var(--shadow-card)] px-3 py-2">
      <div className="text-xs font-semibold text-text-primary mb-1">{label}</div>
      <div className="space-y-0.5">
        {payload
          .filter((entry: any) => entry.value !== undefined && entry.value !== null)
          .map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary">{entry.name}</span>
              <span className="font-medium text-text-primary ml-auto">
                {entry.value}
                {units[entry.name] ?? ""}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function TrendsChart({ logs }: { logs: DailyLog[] }) {
  if (logs.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-text-muted">No data to display trends.</p>
      </Card>
    );
  }

  const data = [...logs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      severity: log.severity_score ?? 0,
      disease: log.disease_percent ?? 0,
      humidity: log.env_data?.humidity,
      temp: log.env_data?.temp,
    }));

  const hasEnv = data.some((d) => d.temp !== undefined || d.humidity !== undefined);

  return (
    <Card>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Health Trends</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Progression across {logs.length} scan{logs.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: hasEnv ? 4 : 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="gradSeverity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.severity} stopOpacity={0.35} />
                <stop offset="100%" stopColor={COLORS.severity} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradDisease" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.disease} stopOpacity={0.28} />
                <stop offset="100%" stopColor={COLORS.disease} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#e8f0e8" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#7a8c7a" }}
              axisLine={{ stroke: "#dceadc" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="pct"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#7a8c7a" }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            {hasEnv && (
              <YAxis
                yAxisId="env"
                orientation="right"
                tick={{ fontSize: 12, fill: "#7a8c7a" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
            )}

            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#c8ddc8", strokeWidth: 1 }} />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="circle"
              iconSize={8}
            />

            <Area
              yAxisId="pct"
              type="monotone"
              dataKey="severity"
              stroke={COLORS.severity}
              strokeWidth={2.5}
              fill="url(#gradSeverity)"
              dot={{ r: 3, strokeWidth: 0, fill: COLORS.severity }}
              activeDot={{ r: 5 }}
              name="Severity"
            />
            <Area
              yAxisId="pct"
              type="monotone"
              dataKey="disease"
              stroke={COLORS.disease}
              strokeWidth={2.5}
              fill="url(#gradDisease)"
              dot={{ r: 3, strokeWidth: 0, fill: COLORS.disease }}
              activeDot={{ r: 5 }}
              name="Disease"
            />
            {data.some((d) => d.humidity !== undefined) && (
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="humidity"
                stroke={COLORS.humidity}
                strokeWidth={1.5}
                strokeDasharray="2 4"
                dot={false}
                name="Humidity"
              />
            )}
            {data.some((d) => d.temp !== undefined) && (
              <Line
                yAxisId="env"
                type="monotone"
                dataKey="temp"
                stroke={COLORS.temp}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="Temp"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
