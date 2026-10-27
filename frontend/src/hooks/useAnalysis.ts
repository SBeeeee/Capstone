import { useAppSelector } from "@/store/store";

export function useAnalysis() {
  const { result, analyzing, error } = useAppSelector(
    (state) => state.analysis
  );

  return {
    result,
    isLoading: analyzing,
    error,
  };
}
