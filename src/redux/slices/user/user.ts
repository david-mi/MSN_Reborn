import { UserState, AuthenticationState } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialUserState: UserState = {
  authenticated: "DISCONNECTED"
}

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setAuthenticationState(state, { payload }: PayloadAction<AuthenticationState>) {
      state.authenticated = payload
    }
  }
})

export const { setAuthenticationState } = userSlice.actions
export const userReducer = userSlice.reducer
