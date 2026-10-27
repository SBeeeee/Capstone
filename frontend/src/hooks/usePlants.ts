import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchPlants, clearError } from "@/store/slices/plantSlice";

export function usePlants() {
  const dispatch = useAppDispatch();
  const { plants, loading, error } = useAppSelector((state) => state.plants);

  const fetchAll = useCallback(() => {
    dispatch(fetchPlants());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    plants,
    isLoading: loading,
    error,
    fetchAll,
    resetError,
  };
}
