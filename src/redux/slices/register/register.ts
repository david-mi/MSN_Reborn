import type { ProfileState, RegistrationStep } from "./types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EmailValidation } from "@/utils/Validation"
import { ProfileFormFields } from "@/Components/Register/ProfileForm/types";
import { createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService, StorageService } from "@/Services";
import { FirebaseError } from "firebase/app";

const initialProfileState: ProfileState = {
  user: {
    email: "",
    password: "",
    username: "",
    avatarSrc: ""
  },
  step: "EMAIL",
  submitStatus: "IDLE",
  submitError: null,
  profile: {
    defaultAvatars: [],
    getDefaultAvatarsStatus: "IDLE",
    getDefaultAvatarsError: null
  }
}

const registerSlice = createSlice({
  name: "register",
  initialState: initialProfileState,
  reducers: {
    completeProfileStep(state, { payload }: PayloadAction<ProfileFormFields>) {
      state.user.avatarSrc = payload.avatarSrc
      state.user.username = payload.username
      state.step = "PASSWORD"
    },
    setPassword(state, { payload }: PayloadAction<string>) {
      state.user.password = payload
    },
    setStep(state, { payload }: PayloadAction<RegistrationStep>) {
      state.step = payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerEmailMiddleware.pending, (state) => {
      state.submitStatus = "PENDING"
    })
    builder.addCase(registerEmailMiddleware.rejected, (state) => {
      state.submitStatus = "REJECTED"
    })
    builder.addCase(registerEmailMiddleware.fulfilled, (state, { payload }) => {
      state.submitStatus = "IDLE"
      state.user.email = payload
      state.step = "PROFILE"
      state.profile.getDefaultAvatarsStatus = "PENDING"
    })
    builder.addCase(setDefaultAvatars.pending, (state) => {
      state.profile.getDefaultAvatarsStatus = "PENDING"
      state.profile.getDefaultAvatarsError = null
    })
    builder.addCase(setDefaultAvatars.rejected, (state, { payload }) => {
      state.profile.getDefaultAvatarsStatus = "REJECTED"
      state.profile.getDefaultAvatarsError = payload as string
    })
    builder.addCase(setDefaultAvatars.fulfilled, (state, { payload }) => {
      state.profile.getDefaultAvatarsStatus = "IDLE"
      state.profile.defaultAvatars = payload
    })
    builder.addCase(createUser.pending, (state) => {
      state.submitStatus = "PENDING"
      state.submitError = null
    })
    builder.addCase(createUser.rejected, (state, { payload, error }) => {
      state.submitStatus = "REJECTED"
      state.submitError = payload || (error as FirebaseError)?.message || "Une erreur est survenue"
    })
    builder.addCase(createUser.fulfilled, (state) => {
      state.submitStatus = "IDLE"
      state.step = "SEND_VERIFICATION_EMAIL"
    })
    builder.addCase(sendVerificationEmail.pending, (state) => {
      state.submitStatus = "PENDING"
      state.submitError = null
    })
    builder.addCase(sendVerificationEmail.rejected, (state, { error }) => {
      state.submitStatus = "REJECTED"
      state.submitError = error.message || "L'envoi du mail de confirmation à échoué"
    })
    builder.addCase(sendVerificationEmail.fulfilled, (state) => {
      state.submitStatus = "IDLE"
    })
  }
})

interface RegisterEmailMiddlewarePayload {
  email: string,
  emailValidation: EmailValidation
}

export const registerEmailMiddleware = createAppAsyncThunk(
  "register/email",
  async ({ email, emailValidation }: RegisterEmailMiddlewarePayload, { rejectWithValue }) => {
    try {
      await emailValidation.checkAvailabilityFromDatabase(email)
      return email
    } catch (error) {
      const errorMessage = (error as Error)?.message ?? "Une erreur est survenue"
      return rejectWithValue(errorMessage)
    }
  })

export const setDefaultAvatars = createAppAsyncThunk(
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

export const createUser = createAppAsyncThunk(
  "register/createUser",
  async (_, { getState, rejectWithValue }) => {
    const { email, password, ...profileData } = getState().register.user
    await AuthService.createUser(email, password)

    try {
      await UserService.setProfile(profileData)
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