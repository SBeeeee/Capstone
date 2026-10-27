import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as plantService from "@/services/plantService";
import type { Plant, DailyLog, SprayEvent } from "@/services/plantService";

interface PlantState {
  plants: Plant[];
  selectedPlant: Plant | null;
  logs: DailyLog[];
  sprays: SprayEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: PlantState = {
  plants: [],
  selectedPlant: null,
  logs: [],
  sprays: [],
  loading: false,
  error: null,
};

export const fetchPlants = createAsyncThunk("plants/fetchAll", async () => {
  return await plantService.getAllPlants();
});

export const fetchPlantById = createAsyncThunk(
  "plants/fetchById",
  async (id: string) => {
    return await plantService.getPlantById(id);
  }
);

export const fetchPlantLogs = createAsyncThunk(
  "plants/fetchLogs",
  async (id: string) => {
    return await plantService.getPlantLogs(id);
  }
);

export const fetchPlantSprays = createAsyncThunk(
  "plants/fetchSprays",
  async (id: string) => {
    return await plantService.getPlantSprays(id);
  }
);

const plantSlice = createSlice({
  name: "plants",
  initialState,
  reducers: {
    clearSelectedPlant(state) {
      state.selectedPlant = null;
      state.logs = [];
      state.sprays = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = action.payload;
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch plants";
      })
      .addCase(fetchPlantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlantById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlant = action.payload;
      })
      .addCase(fetchPlantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch plant";
      })
      .addCase(fetchPlantLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
      })
      .addCase(fetchPlantSprays.fulfilled, (state, action) => {
        state.sprays = action.payload;
      });
  },
});

export const { clearSelectedPlant, clearError } = plantSlice.actions;
export default plantSlice.reducer;
