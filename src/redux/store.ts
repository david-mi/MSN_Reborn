import { configureStore } from "@reduxjs/toolkit";
import { registerSlice } from "./slices/register/register";

const store = configureStore({
  reducer: {
    register: registerSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;