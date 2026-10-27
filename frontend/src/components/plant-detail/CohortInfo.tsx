import { Card, Badge } from "@/components/shared";
import { UsersIcon } from "@/components/shared/icons";
import type { DailyLog } from "@/services/plantService";

export default function CohortInfo({ logs }: { logs: DailyLog[] }) {
  const cohortLogs = logs.filter((log) => log.cohort_verdict);

  if (cohortLogs.length === 0) {
    return null;
  }

  const latest = cohortLogs[0];

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
          <UsersIcon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Cohort Analysis</h3>
      </div>

      <div className="p-4 bg-earth-50 rounded-[var(--radius-md)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Verdict</span>
          <Badge variant={latest.cohort_verdict === "isolated" ? "warning" : "info"}>
            {latest.cohort_verdict === "isolated" ? "Isolated Issue" : "Shared Issue"}
          </Badge>
        </div>
        <p className="text-sm text-text-secondary">
          {latest.cohort_verdict === "isolated"
            ? "This plant's condition appears to be unique to it, not affecting neighboring plants."
            : "This issue is shared across multiple nearby plants, suggesting an environmental cause."}
        </p>
      </div>
    </Card>
  );
}
