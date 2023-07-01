import type { InitialState } from "./types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit"
import { EmailValidation } from "@/utils/Validation"
import { StorageService } from "@/Services/Storage/Storage";
import { ProfileFormFields } from "@/Components/Register/ProfileForm/types";

const initialState: InitialState = {
  user: {
    email: "",
    password: "",
    username: "",
    avatarSrc: ""
  },
  step: "EMAIL",
  submitStatus: "IDLE",
  profile: {
    defaultAvatars: [],
    getDefaultAvatarsStatus: "IDLE"
  }
}

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setavatarSrc(state, { payload }: PayloadAction<string>) {
      state.user.avatarSrc = payload
    },
    completeProfileStep(state, { payload }: PayloadAction<ProfileFormFields>) {
      state.user.avatarSrc = payload.avatarSrc
      state.user.username = payload.username
      state.step = "PASSWORD"
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerEmailMiddleware.pending, (state) => {
      state.submitStatus = "PENDING"
    })
    builder.addCase(registerEmailMiddleware.rejected, (state) => {
      state.submitStatus = "REJECTED"
    })
    builder.addCase(registerEmailMiddleware.fulfilled, (state, { payload }: PayloadAction<string>) => {
      state.submitStatus = "IDLE"
      state.user.email = payload
      state.step = "PROFILE"
      state.profile.getDefaultAvatarsStatus = "PENDING"
    })
    builder.addCase(setDefaultAvatars.pending, (state) => {
      state.profile.getDefaultAvatarsStatus = "PENDING"
    })
    builder.addCase(setDefaultAvatars.rejected, (state) => {
      state.profile.getDefaultAvatarsStatus = "REJECTED"
    })
    builder.addCase(setDefaultAvatars.fulfilled, (state, { payload }: PayloadAction<string[]>) => {
      state.profile.getDefaultAvatarsStatus = "IDLE"
      state.profile.defaultAvatars = payload
    })
  }
})

interface RegisterEmailMiddlewarePayload {
  email: string,
  emailValidation: EmailValidation
}

export const registerEmailMiddleware = createAsyncThunk(
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

export const setDefaultAvatars = createAsyncThunk(
  "register/profile/avatars",
  async (_, { rejectWithValue }) => {
    try {
      const storageService = new StorageService()
      const defaultAvatarsFolderPath = storageService.FOLDERS_PATHS.DEFAULT_AVATARS
      const defaultAvatarsUrls = await storageService.getFilesUrl(defaultAvatarsFolderPath)
      return defaultAvatarsUrls
    } catch (error) {
      const errorMessage = (error as Error)?.message ?? "Une erreur est survenue"
      return rejectWithValue(errorMessage)
    }
  })

export const { setavatarSrc, completeProfileStep } = registerSlice.actions
export const registerReducer = registerSlice.reducer