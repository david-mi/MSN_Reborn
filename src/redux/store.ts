import { configureStore, PreloadedState, combineReducers } from "@reduxjs/toolkit";
import { registerSlice } from "./slices/register/register";

const rootReducer = combineReducers({
  register: registerSlice.reducer
})

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

const store = setupStore()

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export default store;