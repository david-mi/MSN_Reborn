import { UserSlice, AuthenticationState } from "./types";
import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { AppThunkDispatch, createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { UserProfile } from "./types";

export const disconnectAction = createAction("reset")

export const initialUserState: UserSlice = {
  id: "",
  avatarSrc: "",
  username: "",
  displayedStatus: "offline",
  personalMessage: "",
  email: "",
  authState: "PENDING",
  verified: false,
  accountVerificationRequest: {
    status: "PENDING",
    error: null
  },
  getProfile: {
    status: "PENDING",
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
    },
    setProfile(state, { payload }: PayloadAction<UserProfile>) {
      return {
        ...state,
        getProfile: {
          status: "IDLE",
          error: null
        },
        ...payload
      }
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
    builder.addCase(disconnectAction, () => {
      return {
        ...initialUserState,
        authState: "DISCONNECTED"
      }
    })
  }
})

export const verifyEmail = createAppAsyncThunk(
  "register/verifyEmail",
  (oobCode: string | null) => AuthService.verifyEmail(oobCode)
)

export function checkIfUserIsVerified() {
  return async (dispatch: AppThunkDispatch) => {
    const isUserVerified = await UserService.checkIfVerified()
    if (isUserVerified) {
      dispatch(setVerified(true))
    }

    return isUserVerified
  }
}

export const disconnect = createAppAsyncThunk(
  "user/disconnect",
  async (_, { dispatch }) => {
    await AuthService.disconnect()
    dispatch(disconnectAction())
  }
)

export const editProfile = createAppAsyncThunk(
  "user/editProfile",
  async (profileData: Omit<UserProfile, "email" | "id">) => {
    await UserService.updateProfile(profileData)
    return profileData
  }
)

export const { setVerified, setAuthenticationState, setProfile } = userSlice.actions
export const userReducer = userSlice.reducer
