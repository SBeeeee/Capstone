import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as analysisService from "@/services/analysisService";
import type { ScanResult } from "@/services/analysisService";

interface AnalysisState {
  result: ScanResult | null;
  uploading: boolean;
  analyzing: boolean;
  error: string | null;
  preview: string | null;
}

const initialState: AnalysisState = {
  result: null,
  uploading: false,
  analyzing: false,
  error: null,
  preview: null,
};

export const runScan = createAsyncThunk(
  "analysis/scan",
  async (formData: FormData) => {
    return await analysisService.scanPlant(formData);
  }
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setPreview(state, action: PayloadAction<string | null>) {
      state.preview = action.payload;
    },
    resetAnalysis(state) {
      state.result = null;
      state.uploading = false;
      state.analyzing = false;
      state.error = null;
      state.preview = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runScan.pending, (state) => {
        state.uploading = true;
        state.analyzing = true;
        state.error = null;
        state.result = null;
      })
      .addCase(runScan.fulfilled, (state, action) => {
        state.uploading = false;
        state.analyzing = false;
        state.result = action.payload;
      })
      .addCase(runScan.rejected, (state, action) => {
        state.uploading = false;
        state.analyzing = false;
        state.error = action.error.message || "Scan failed";
      });
  },
});

export const { setPreview, resetAnalysis, clearError } = analysisSlice.actions;
export default analysisSlice.reducer;
