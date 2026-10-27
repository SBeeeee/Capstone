export interface MLPrediction {
  disease: string;
  confidence: number;
  severity: number;
  bounding_boxes: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    confidence: number;
  }>;
}

export async function getPrediction(_imageFile: File): Promise<MLPrediction> {
  // Stubbed - will connect to YOLO v11 service later
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    disease: "Healthy",
    confidence: 0.95,
    severity: 0,
    bounding_boxes: [],
  };
}
