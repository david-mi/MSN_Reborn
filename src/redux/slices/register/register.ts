import type { RegisterSlice, RegistrationStep } from "./types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProfileFormFields } from "@/Components/Register/ProfileForm/types";
import { createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService, StorageService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";

const initialRegisterState: RegisterSlice = {
  userData: {
    email: "",
    password: "",
    username: "",
    avatarSrc: ""
  },
  step: "EMAIL",
  request: {
    status: "IDLE",
    error: null,
  },
  defaultAvatars: [],
  getDefaultAvatarsRequest: {
    status: "IDLE",
    error: null
  }
}

const registerSlice = createSlice({
  name: "register",
  initialState: initialRegisterState,
  reducers: {
    completeProfileStep(state, { payload }: PayloadAction<ProfileFormFields>) {
      state.userData.avatarSrc = payload.avatarSrc
      state.userData.username = payload.username
      state.step = "PASSWORD"
    },
    setPassword(state, { payload }: PayloadAction<string>) {
      state.userData.password = payload
    },
    setStep(state, { payload }: PayloadAction<RegistrationStep>) {
      state.step = payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerIfEmailIsAvailable.pending, (state) => {
      state.request.status = "PENDING"
    })
    builder.addCase(registerIfEmailIsAvailable.rejected, (state) => {
      state.request.status = "REJECTED"
    })
    builder.addCase(registerIfEmailIsAvailable.fulfilled, (state, { payload }) => {
      state.request.status = "IDLE"
      state.userData.email = payload
      state.step = "PROFILE"
    })
    builder.addCase(getDefaultAvatars.pending, (state) => {
      state.getDefaultAvatarsRequest.status = "PENDING"
      state.getDefaultAvatarsRequest.error = null
    })
    builder.addCase(getDefaultAvatars.rejected, (state, { payload }) => {
      state.getDefaultAvatarsRequest.status = "REJECTED"
      state.getDefaultAvatarsRequest.error = payload as string
    })
    builder.addCase(getDefaultAvatars.fulfilled, (state, { payload }) => {
      state.getDefaultAvatarsRequest.status = "IDLE"
      state.defaultAvatars = payload
    })
    builder.addCase(createUserAndSetProfile.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(createUserAndSetProfile.rejected, (state, { payload, error }) => {
      state.request.status = "REJECTED"
      state.request.error = payload || (error as FirebaseError)?.message || "Une erreur est survenue"
    })
    builder.addCase(createUserAndSetProfile.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(sendVerificationEmail.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(sendVerificationEmail.rejected, (state, { error }) => {
      state.request.status = "REJECTED"
      state.request.error = error.message || "L'envoi du mail de confirmation à échoué"
    })
    builder.addCase(sendVerificationEmail.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(disconnectAction, (state) => {
      return {
        ...initialRegisterState,
        defaultAvatars: state.defaultAvatars
      }
    })
  }
})

interface RegisterIfEmailIsAvailablePayload {
  email: string,
}

export const registerIfEmailIsAvailable = createAppAsyncThunk(
  "register/email",
  async ({ email }: RegisterIfEmailIsAvailablePayload, { rejectWithValue }) => {
    try {
      await AuthService.checkDatabaseEmailAvailability(email)
      return email
    } catch (error) {
      const errorMessage = (error as Error)?.message ?? "Une erreur est survenue"
      return rejectWithValue(errorMessage)
    }
  })

export const getDefaultAvatars = createAppAsyncThunk(
  "register/getDefaultAvatars",
  async (_, { rejectWithValue }) => {
    try {
      const defaultAvatarsFolderPath = StorageService.FOLDERS_PATHS.DEFAULT_AVATARS
      const defaultAvatarsUrls = await StorageService.getFilesUrl(defaultAvatarsFolderPath)
      return defaultAvatarsUrls
    } catch (error) {
      const errorMessage = (error as Error)?.message ?? "Une erreur est survenue"
      return rejectWithValue(errorMessage)
    }
  })

export const createUserAndSetProfile = createAppAsyncThunk(
  "register/createUserAndSetProfile",
  async (_, { getState, rejectWithValue }) => {
    const { email, password, ...profileData } = getState().register.userData
    await AuthService.createUser(email, password)

    try {
      return UserService.setProfile(profileData)
    } catch (error) {
      await UserService.deleteAccount()
      return rejectWithValue((error as FirebaseError).message)
    }
  })

export const sendVerificationEmail = createAppAsyncThunk(
  "register/sendConfirmationEmail",
  () => AuthService.sendVerificationEmail()
)

export const { completeProfileStep, setPassword, setStep } = registerSlice.actions
export const registerReducer = registerSlice.reducer