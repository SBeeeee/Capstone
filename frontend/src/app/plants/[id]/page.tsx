"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Container, Button } from "@/components/shared";
import { usePlantDetail } from "@/hooks/usePlantDetail";
import HealthProfile from "@/components/plant-detail/HealthProfile";
import DecisionPanel from "@/components/plant-detail/DecisionPanel";
import HistoryTimeline from "@/components/plant-detail/HistoryTimeline";
import TrendsChart from "@/components/plant-detail/TrendsChart";
import DecisionLog from "@/components/plant-detail/DecisionLog";
import CohortInfo from "@/components/plant-detail/CohortInfo";
import Link from "next/link";

export default function PlantDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { plant, logs, sprays, isLoading, error, fetchDetail } = usePlantDetail();

  useEffect(() => {
    if (id) fetchDetail(id);
  }, [id, fetchDetail]);

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-primary-100 rounded w-1/3" />
          <div className="h-48 bg-primary-100 rounded-[var(--radius-lg)]" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-primary-100 rounded-[var(--radius-lg)]" />
            <div className="h-64 bg-primary-100 rounded-[var(--radius-lg)]" />
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12">
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </Container>
    );
  }

  if (!plant) {
    return (
      <Container className="py-12">
        <div className="text-center py-20">
          <p className="text-text-muted mb-4">Plant not found.</p>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Link href="/plants" className="text-sm text-primary-600 hover:text-primary-700 mb-6 inline-block">
        &larr; Back to Plants
      </Link>

      <div className="space-y-6">
        <HealthProfile plant={plant} latestImage={logs[0]?.image_url} />

        <DecisionPanel logs={logs} />

        <CohortInfo logs={logs} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendsChart logs={logs} />
          <DecisionLog sprays={sprays} />
        </div>

        <HistoryTimeline logs={logs} />
      </div>
    </Container>
  );
}
