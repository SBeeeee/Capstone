"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container, SectionHeader, Card, Button } from "@/components/shared";
import { usePlants } from "@/hooks/usePlants";
import PlantCard from "@/components/plants/PlantCard";
import PlantStats from "@/components/plants/PlantStats";

export default function PlantsPage() {
  const { plants, isLoading, error, fetchAll } = usePlants();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <Container className="py-10">
      <SectionHeader
        title="Plants"
        subtitle="Every registered plant — click one to see its full scan history and spray decisions"
      />

      {isLoading && plants.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-primary-100 rounded w-1/2" />
                <div className="h-4 bg-primary-100 rounded w-3/4" />
                <div className="h-20 bg-primary-100 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchAll}>
            Retry
          </Button>
        </Card>
      ) : plants.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-text-muted">No plants yet.</p>
          <p className="mt-2 text-sm text-text-muted">
            Scan a plant from the home page — it registers automatically.
          </p>
          <Link href="/#upload" className="mt-6 inline-block">
            <Button variant="outline">Go to Upload</Button>
          </Link>
        </Card>
      ) : (
        <>
          <PlantStats plants={plants} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant.plant_id} plant={plant} />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
