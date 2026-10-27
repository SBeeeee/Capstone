"use client";

import { useEffect, useRef, useState, DragEvent, ChangeEvent } from "react";
import Link from "next/link";
import {
  Container,
  SectionHeader,
  Card,
  Button,
  Badge,
  ProgressBar,
  UploadIcon,
  ChevronRightIcon,
  ShieldIcon,
} from "@/components/shared";
import { useUpload } from "@/hooks/useUpload";
import { usePlants } from "@/hooks/usePlants";
import { prettifyEnum, prettifyReason } from "@/lib/format";
import { ACTION_META } from "@/lib/decisionConfig";

export default function UploadSection() {
  const { result, analyzing, error, preview, scanImage, setPreviewImage, reset } =
    useUpload();
  const { fetchAll } = usePlants();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [moisture, setMoisture] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (result) fetchAll();
  }, [result, fetchAll]);

  const pickFile = (selected: File) => {
    if (!selected.type.startsWith("image/")) return;
    setFile(selected);
    setPreviewImage(URL.createObjectURL(selected));
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) pickFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) pickFile(e.target.files[0]);
  };

  const handleScan = () => {
    if (!file) return;
    scanImage({ file, label, temperature, humidity, moisture });
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  const envField = (
    id: string,
    fieldLabel: string,
    value: string,
    setter: (v: string) => void,
    placeholder: string
  ) => (
    <label className="block">
      <span className="text-xs text-text-muted uppercase tracking-wider">
        {fieldLabel}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-primary-200 bg-surface-card focus:outline-none focus:border-primary-500"
      />
    </label>
  );

  return (
    <section id="upload" className="py-20">
      <Container size="narrow">
        <SectionHeader
          title="Upload & Analyze"
          subtitle="Drop a plant leaf photo to get an instant AI-powered disease diagnosis and spray decision"
        />

        <Card className="relative">
          {result ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-primary">
                  Analysis Result
                </h3>
                <Badge variant={ACTION_META[result.decision.action].variant}>
                  {ACTION_META[result.decision.action].label}
                </Badge>
              </div>

              {preview && (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Analyzed plant"
                    className="max-h-48 rounded-[var(--radius-md)] object-contain"
                  />
                </div>
              )}

              <div
                className={`p-4 rounded-[var(--radius-md)] border flex gap-3 ${ACTION_META[result.decision.action].box}`}
              >
                <div
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${ACTION_META[result.decision.action].icon}`}
                >
                  <ShieldIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    {result.decision.message}
                  </div>
                  <div className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {prettifyReason(result.decision.reason)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-earth-50 rounded-[var(--radius-md)]">
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    Diagnosis
                  </div>
                  <div className="mt-1 font-semibold text-text-primary capitalize">
                    {prettifyEnum(result.diagnosis.disease)}
                  </div>
                </div>
                <div className="p-4 bg-earth-50 rounded-[var(--radius-md)]">
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    Disease %
                  </div>
                  <div className="mt-1 font-semibold text-text-primary">
                    {result.diagnosis.disease_percent}%
                  </div>
                </div>
                <div className="p-4 bg-earth-50 rounded-[var(--radius-md)]">
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    Env Risk
                  </div>
                  <div className="mt-1 font-semibold text-text-primary">
                    {prettifyEnum(result.decision.env_risk)}
                  </div>
                </div>
                <div className="p-4 bg-earth-50 rounded-[var(--radius-md)]">
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    Camera Risk
                  </div>
                  <div className="mt-1 font-semibold text-text-primary capitalize">
                    {result.decision.camera_risk}
                  </div>
                </div>
                <div className="p-4 bg-earth-50 rounded-[var(--radius-md)]">
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    Pesticide
                  </div>
                  <div className="mt-1 font-semibold text-text-primary">
                    {result.decision.pesticide}
                  </div>
                </div>
                <div className="p-4 bg-earth-50 rounded-[var(--radius-md)]">
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    Dosage
                  </div>
                  <div className="mt-1 font-semibold text-text-primary">
                    {result.decision.dosage_ml} ml
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider mb-2">
                  Severity Score
                </div>
                <ProgressBar value={result.diagnosis.severity_score} variant="severity" />
              </div>

              <div className="flex items-center justify-between gap-4 p-4 bg-earth-50 rounded-[var(--radius-md)]">
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    Identified Plant
                  </div>
                  <div className="mt-1 font-semibold text-text-primary">
                    {result.plant_id}
                  </div>
                  <div className="text-xs text-text-muted mt-1 flex items-center gap-2">
                    <span>matched via {result.identification.source}</span>
                    {result.identification.created && (
                      <Badge variant="info">Auto-registered</Badge>
                    )}
                  </div>
                </div>
                <Link href={`/plants/${result.plant_id}`}>
                  <Button variant="outline" size="sm">
                    View Plant History
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <Button variant="outline" onClick={handleReset} className="w-full">
                Analyze Another Photo
              </Button>
            </div>
          ) : analyzing ? (
            <div className="py-16 text-center">
              {preview && (
                <img
                  src={preview}
                  alt="Analyzing"
                  className="max-h-48 rounded-[var(--radius-md)] object-contain mx-auto mb-6 opacity-60"
                />
              )}
              <div className="flex justify-center mb-4">
                <svg className="animate-spin h-10 w-10 text-primary-600" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-text-primary">
                Analyzing your plant...
              </p>
              <p className="text-sm text-text-muted mt-1">
                Reading label, classifying disease and computing the decision
              </p>
            </div>
          ) : (
            <>
              {!preview ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-[var(--radius-lg)] p-12 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? "border-primary-500 bg-primary-50"
                      : "border-primary-200 hover:border-primary-400 hover:bg-primary-50/50"
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary-100 text-primary-600 rounded-2xl">
                      <UploadIcon className="w-10 h-10" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-text-primary">
                    Drop your plant photo here
                  </p>
                  <p className="mt-2 text-sm text-text-muted">
                    or click to browse. Supports JPG, PNG, WEBP
                  </p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 rounded-[var(--radius-md)] object-contain"
                  />
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {envField("label", "Plant label", label, setLabel, "Plant A")}
                {envField("temperature", "Temp °C", temperature, setTemperature, "22")}
                {envField("humidity", "Humidity %", humidity, setHumidity, "88")}
                {envField("moisture", "Moisture %", moisture, setMoisture, "65")}
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Label + readings are optional but recommended — they enable the
                environmental risk and spray decision. If the image has a printed
                label, OCR reads it automatically.
              </p>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <Button onClick={handleScan} disabled={!file} loading={analyzing}>
                  Scan Plant
                </Button>
                {(file || label) && (
                  <Button variant="outline" onClick={handleReset}>
                    Clear
                  </Button>
                )}
              </div>
            </>
          )}
        </Card>

        <div className="mt-8 p-6 bg-primary-50 rounded-[var(--radius-lg)] border border-primary-100">
          <h4 className="font-semibold text-primary-800 text-sm">
            Raspberry Pi Integration
          </h4>
          <p className="mt-2 text-sm text-primary-700">
            Devices post images programmatically via{" "}
            <code className="bg-primary-100 px-1.5 py-0.5 rounded text-xs font-mono">
              POST /api/scan
            </code>{" "}
            with multipart form data (<code className="text-xs font-mono">image, device_id, soil, moisture, temperature, humidity</code>).
          </p>
        </div>
      </Container>
    </section>
  );
}
