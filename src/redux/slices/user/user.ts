import { UserState, AuthenticationState, DisplayedStatus } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService } from "@/Services";
import { LoginFormFields } from "@/Components/Login/LoginForm/types";
import { FirebaseError } from "firebase/app";
import { UserProfile } from "@/Services/User/User";

export const initialUserState: UserState = {
  avatarSrc: "",
  username: "",
  authState: "PENDING",
  verified: false,
  displayedStatus: "offline",
  accountVerification: {
    status: "PENDING",
    error: null
  },
  login: {
    status: "IDLE",
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
    setAuthenticationState(state, { payload }: PayloadAction<AuthenticationState>) {
      state.authState = payload
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
    builder.addCase(loginMiddleware.pending, (state) => {
      state.login.status = "PENDING"
      state.login.error = null
    })
    builder.addCase(loginMiddleware.rejected, (state, { error }) => {
      state.login.status = "REJECTED"
      state.login.error = (error as FirebaseError).message
    })
    builder.addCase(loginMiddleware.fulfilled, (state) => {
      state.login.status = "IDLE"
      state.authState = "AUTHENTICATED"
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
    builder.addCase(checkAccountVerification.fulfilled, (state, { payload }: PayloadAction<boolean>) => {
      state.verified = payload
    })
  }
})

export const verifyEmail = createAppAsyncThunk(
  "register/verifyEmail",
  (oobCode: string | null) => AuthService.verifyEmail(oobCode)
)

export const checkAccountVerification = createAppAsyncThunk(
  "register/checkAccountVerification",
  () => UserService.checkIfVerified()
)

export const loginMiddleware = createAppAsyncThunk(
  "user/login",
  async (loginData: LoginFormFields) => {
    const { email, password, displayedStatus, rememberAuth } = loginData

    await AuthService.setPersitence(rememberAuth)
    await AuthService.login(email, password)
    await UserService.updateProfile({ displayedStatus })
  })

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

export const { setAuthenticationState, setVerified } = userSlice.actions
export const userReducer = userSlice.reducer
