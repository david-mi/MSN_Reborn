import { UserState, AuthenticationState } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunkDispatch, createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { UserProfile } from "./types";

export const initialUserState: UserState = {
  avatarSrc: "",
  username: "",
  displayedStatus: "offline",
  personalMessage: "",
  authState: "PENDING",
  verified: false,
  accountVerification: {
    status: "PENDING",
    error: null
  },
  retrieveProfile: {
    status: "IDLE",
    error: null
  },
}

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setVerified(state, { payload }: PayloadAction<boolean>) {
      state.verified = payload
    },
    setAuthenticationState(state, { payload }: PayloadAction<AuthenticationState>) {
      state.authState = payload
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
    builder.addCase(retrieveProfile.pending, (state) => {
      state.retrieveProfile.status = "PENDING"
      state.retrieveProfile.error = null
    })
    builder.addCase(retrieveProfile.rejected, (state, { error }) => {
      state.retrieveProfile.status = "REJECTED"
      state.retrieveProfile.error = (error as FirebaseError).message
    })
    builder.addCase(retrieveProfile.fulfilled, (state, { payload }: PayloadAction<UserProfile & { verified: boolean }>) => {
      state.retrieveProfile.status = "IDLE"
      state.avatarSrc = payload.avatarSrc
      state.username = payload.username
      state.displayedStatus = payload.displayedStatus
      state.verified = payload.verified
    })
  }
})

export const verifyEmail = createAppAsyncThunk(
  "register/verifyEmail",
  async (oobCode: string | null) => {
    await AuthService.verifyEmail(oobCode)
    localStorage.setItem("verified", "true")
  }
)

export function checkIfVerifiedFromLocalStorage() {
  return (dispatch: AppThunkDispatch) => {
    const hasVerifiedKeyInStorage = localStorage.getItem("verified")

    if (hasVerifiedKeyInStorage) {
      localStorage.removeItem("verified")
      dispatch(setVerified(true))
    }
  }
}

export const disconnectMiddleware = createAppAsyncThunk(
  "user/disconnect",
  () => AuthService.disconnect()
)

export const retrieveProfile = createAppAsyncThunk(
  "user/retrieveProfile",
  async () => {
    const profileInfos = await UserService.getProfile()
    const isVerified = await UserService.checkIfVerified()

    return {
      ...profileInfos,
      verified: isVerified
    }
  }
)

export const { setVerified, setAuthenticationState } = userSlice.actions
export const userReducer = userSlice.reducer
