import { UserState, AuthenticationState } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { AuthService } from "@/Services";

const initialUserState: UserState = {
  authenticated: "DISCONNECTED",
  verified: false,
  accountVerification: {
    status: "PENDING",
    error: null
  }
}

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setAuthenticationState(state, { payload }: PayloadAction<AuthenticationState>) {
      state.authenticated = payload
    },
    setVerified(state, { payload }: PayloadAction<boolean>) {
      state.verified = payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(verifyEmail.pending, (state) => {
      state.accountVerification.status = "PENDING"
      state.accountVerification.error = null
    })
    builder.addCase(verifyEmail.rejected, (state, { error }) => {
      state.accountVerification.status = "REJECTED"
      state.accountVerification.error = error.code === "auth/invalid-action-code"
        ? "Code de validation invalide"
        : error.message!
    })
    builder.addCase(verifyEmail.fulfilled, (state) => {
      state.accountVerification.status = "IDLE"
      state.verified = true
    })
  }
})

export const verifyEmail = createAppAsyncThunk(
  "register/verifyEmail",
  (oobCode: string | null) => AuthService.verifyEmail(oobCode)
)

export const { setAuthenticationState, setVerified } = userSlice.actions
export const userReducer = userSlice.reducer
