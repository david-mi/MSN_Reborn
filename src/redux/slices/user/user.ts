import { UserSlice, AuthenticationState } from "./types";
import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { AppThunkDispatch, createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { UserProfile } from "./types";
export const disconnectAction = createAction("reset")

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
  editProfileRequest: {
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
    builder.addCase(editProfile.pending, (state) => {
      state.editProfileRequest.status = "PENDING"
      state.editProfileRequest.error = null
    })
    builder.addCase(editProfile.rejected, (state, { error }) => {
      state.editProfileRequest.status = "REJECTED"
      state.editProfileRequest.error = (error as FirebaseError).message
    })
    builder.addCase(editProfile.fulfilled, (state, { payload }) => {
      state.avatarSrc = payload.avatarSrc
      state.username = payload.username
      state.displayedStatus = payload.displayedStatus
      state.personalMessage = payload.personalMessage
      state.editProfileRequest.status = "IDLE"
    })
    builder.addCase(resetAction, () => initialUserState)
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
  async (_, { dispatch }) => {
    await AuthService.disconnect()
    dispatch(disconnectAction())
  }
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

export const editProfile = createAppAsyncThunk(
  "user/editProfile",
  async (profileData: UserProfile) => {
    await UserService.updateProfile(profileData)
    return profileData
  }
)

export const { setVerified, setAuthenticationState } = userSlice.actions
export const userReducer = userSlice.reducer
