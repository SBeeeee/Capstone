"use client";

import Link from "next/link";
import { Button, Container, LeafIcon } from "@/components/shared";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-accent-400 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-primary-300 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-secondary-400 blur-2xl" />
      </div>

      <Container className="relative py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <LeafIcon className="w-10 h-10 text-accent-400" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Protect Your Crops with{" "}
            <span className="text-accent-400">AI-Powered</span> Detection
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-primary-200 max-w-2xl mx-auto leading-relaxed">
            DeepLeaf uses advanced machine learning to detect plant diseases from a single photo.
            Get instant diagnosis, treatment recommendations, and keep your crops healthy.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#upload">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Upload a Photo
              </Button>
            </Link>
            <Link href="/plants">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] border-white text-white hover:bg-white/10"
              >
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-primary-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-400" />
              Real-time Detection
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-400" />
              Treatment Plans
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-400" />
              Raspberry Pi Ready
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
