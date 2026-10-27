import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  uploadModalOpen: boolean;
  activeTab: string;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  uploadModalOpen: false,
  activeTab: "overview",
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setUploadModalOpen(state, action: PayloadAction<boolean>) {
      state.uploadModalOpen = action.payload;
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setUploadModalOpen, setActiveTab, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
