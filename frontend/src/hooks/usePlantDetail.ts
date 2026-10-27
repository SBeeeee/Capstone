import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchPlantById,
  fetchPlantLogs,
  fetchPlantSprays,
  clearSelectedPlant,
} from "@/store/slices/plantSlice";

export function usePlantDetail() {
  const dispatch = useAppDispatch();
  const { selectedPlant, logs, sprays, loading, error } = useAppSelector(
    (state) => state.plants
  );

  const fetchDetail = useCallback(
    (id: string) => {
      dispatch(fetchPlantById(id));
      dispatch(fetchPlantLogs(id));
      dispatch(fetchPlantSprays(id));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearSelectedPlant());
  }, [dispatch]);

  return {
    plant: selectedPlant,
    logs,
    sprays,
    isLoading: loading,
    error,
    fetchDetail,
    clear,
  };
}
