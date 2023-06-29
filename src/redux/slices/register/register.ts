import type { InitialState } from "./types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit"
import { EmailValidation } from "@/utils/Validation"
import { StorageService } from "@/Services/Storage";

const initialState: InitialState = {
  user: {
    email: "",
    password: "",
    nickname: "",
    avatar: ""
  },
  step: "EMAIL",
  submitStatus: "IDLE",
  profile: {
    defaultAvatars: [],
    getDefaultAvatarsStatus: "PENDING"
  }
}

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
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
    })
    builder.addCase(defaultAvatarsMiddleware.pending, (state) => {
      state.profile.getDefaultAvatarsStatus = "PENDING"
    })
    builder.addCase(defaultAvatarsMiddleware.rejected, (state) => {
      state.profile.getDefaultAvatarsStatus = "REJECTED"
    })
    builder.addCase(defaultAvatarsMiddleware.fulfilled, (state, { payload }: PayloadAction<string[]>) => {
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

export const defaultAvatarsMiddleware = createAsyncThunk(
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


export const registerReducer = registerSlice.reducer