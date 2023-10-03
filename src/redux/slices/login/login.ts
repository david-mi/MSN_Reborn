import { LoginSlice } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { AuthService, OptionsService, UserService } from "@/Services";
import { LoginFormFields } from "@/Components/Login/LoginForm/types";
import { FirebaseError } from "firebase/app";
import { disconnectAction, setAuthenticationState, setVerified } from "../user/user";
import { UserProfile } from "../user/types";

export const initialLoginState: LoginSlice = {
  isUsingOAuth: false,
  request: {
    status: "IDLE",
    error: null
  }
}

const loginSlice = createSlice({
  name: "user",
  initialState: initialLoginState,
  reducers: {
    setIsUsingOAuth(state, { payload }: PayloadAction<boolean>) {
      state.isUsingOAuth = payload
    },
    resetRequestState(state) {
      state.request = {
        status: "IDLE",
        error: null
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAndUpdateDisplayStatus.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(loginAndUpdateDisplayStatus.rejected, (state, { error }) => {
      state.request.status = "REJECTED"
      state.request.error = (error as FirebaseError).message
    })
    builder.addCase(loginAndUpdateDisplayStatus.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(authenticateWithGoogle.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(authenticateWithGoogle.rejected, (state, { error }) => {
      state.request.status = "REJECTED"
      state.request.error = (error as FirebaseError).message
    })
    builder.addCase(authenticateWithGoogle.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(disconnectAction, () => initialLoginState)
  }
})

export const loginAndUpdateDisplayStatus = createAppAsyncThunk(
  "user/loginAndUpdateDisplayStatus",
  async (loginData: LoginFormFields) => {
    const { email, password, displayedStatus, rememberAuth } = loginData

    await AuthService.setPersitence(rememberAuth)
    await AuthService.login(email, password)
    await UserService.updateProfile({ displayedStatus, statusBeforeDisconnect: displayedStatus })
  })

export const authenticateWithGoogle = createAppAsyncThunk(
  "user/authenticateWithGoogle",
  async (_, { dispatch }) => {
    dispatch(setIsUsingOAuth(true))
    const user = await AuthService.loginWithGoogle()
    const userProfile: Pick<UserProfile, "avatarSrc" | "email" | "username"> = {
      avatarSrc: user.photoURL!,
      email: user.email!,
      username: user.displayName!
    }

    const userProfileExist = await UserService.checkIfCurrentUserProfileExist()
    if (userProfileExist === false) {
      await UserService.setProfile(userProfile)
      await OptionsService.set()
    }

    dispatch(setAuthenticationState("AUTHENTICATED"))
    dispatch(setVerified(true))
    dispatch(setIsUsingOAuth(false))
  })

export const loginReducer = loginSlice.reducer
export const { setIsUsingOAuth, resetRequestState } = loginSlice.actions
