import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import plantReducer from "./slices/plantSlice";
import analysisReducer from "./slices/analysisSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    plants: plantReducer,
    analysis: analysisReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
