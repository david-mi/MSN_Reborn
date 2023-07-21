import { UserSlice, AuthenticationState } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunkDispatch, createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { UserProfile } from "./types";

export const initialUserState: UserSlice = {
  avatarSrc: "",
  username: "",
  displayedStatus: "offline",
  personalMessage: "",
  authState: "PENDING",
  verified: false,
  accountVerificationRequest: {
    status: "PENDING",
    error: null
  },
  getProfileRequest: {
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
      state.accountVerificationRequest.status = "PENDING"
      state.accountVerificationRequest.error = null
    })
    builder.addCase(verifyEmail.rejected, (state, { error }) => {
      state.accountVerificationRequest.status = "REJECTED"
      state.accountVerificationRequest.error = error.code === "auth/invalid-action-code"
        ? "Code de validation invalide"
        : error.message!
    })
    builder.addCase(verifyEmail.fulfilled, (state) => {
      state.accountVerificationRequest.status = "IDLE"
      state.verified = true
    })
    builder.addCase(getProfile.pending, (state) => {
      state.getProfileRequest.status = "PENDING"
      state.getProfileRequest.error = null
    })
    builder.addCase(getProfile.rejected, (state, { error }) => {
      state.getProfileRequest.status = "REJECTED"
      state.getProfileRequest.error = (error as FirebaseError).message
    })
    builder.addCase(getProfile.fulfilled, (state, { payload }: PayloadAction<UserProfile & { verified: boolean }>) => {
      state.getProfileRequest.status = "IDLE"
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

export function handleVerifiedFromLocalStorage() {
  return (dispatch: AppThunkDispatch) => {
    const hasVerifiedKeyInStorage = localStorage.getItem("verified")

    if (hasVerifiedKeyInStorage) {
      localStorage.removeItem("verified")
      dispatch(setVerified(true))
    }
  }
}

export const disconnect = createAppAsyncThunk(
  "user/disconnect",
  () => AuthService.disconnect()
)

export const getProfile = createAppAsyncThunk(
  "user/getProfile",
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
