import { configureStore, PreloadedState, combineReducers } from "@reduxjs/toolkit";
import { registerReducer } from "./slices/register/register";
import { userReducer } from "./slices/user/user";
import { loginReducer } from "./slices/login/login";
import { contactReducer } from "./slices/contact/contact";

const rootReducer = combineReducers({
  register: registerReducer,
  login: loginReducer,
  user: userReducer,
  contact: contactReducer
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