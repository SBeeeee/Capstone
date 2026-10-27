import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { runScan, setPreview, resetAnalysis } from "@/store/slices/analysisSlice";

export interface ScanInput {
  file: File;
  label?: string;
  temperature?: string;
  humidity?: string;
  moisture?: string;
}

export function useUpload() {
  const dispatch = useAppDispatch();
  const { result, uploading, analyzing, error, preview } = useAppSelector(
    (state) => state.analysis
  );

  const scanImage = useCallback(
    (input: ScanInput) => {
      const formData = new FormData();
      formData.append("image", input.file);

      const optional: Record<string, string | undefined> = {
        label: input.label,
        temperature: input.temperature,
        humidity: input.humidity,
        moisture: input.moisture,
      };
      for (const [key, value] of Object.entries(optional)) {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      }

      dispatch(runScan(formData));
    },
    [dispatch]
  );

  const setPreviewImage = useCallback(
    (url: string | null) => {
      dispatch(setPreview(url));
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch(resetAnalysis());
  }, [dispatch]);

  return {
    result,
    uploading,
    analyzing,
    error,
    preview,
    scanImage,
    setPreviewImage,
    reset,
  };
}
