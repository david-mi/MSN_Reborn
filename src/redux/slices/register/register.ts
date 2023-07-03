import type { ProfileState } from "./types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EmailValidation } from "@/utils/Validation"
import { StorageService } from "@/Services/Storage/Storage";
import { ProfileFormFields } from "@/Components/Register/ProfileForm/types";
import { createAppAsyncThunk } from "@/redux/types";
import { firebase } from "@/firebase/config";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth"

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

export const registerSlice = createSlice({
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
    builder.addCase(createUser.pending, (state) => {
      state.submitStatus = "PENDING"
      state.submitError = null
    })
    builder.addCase(createUser.rejected, (state, { error }) => {
      state.submitStatus = "REJECTED"
      state.submitError = error.message || "une erreur est survenue lors de l'inscription"
    })
    builder.addCase(createUser.fulfilled, (state) => {
      state.submitStatus = "IDLE"
      state.step = "SEND_CONFIRMATION_EMAIL"
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
      const storageService = new StorageService()
      const defaultAvatarsFolderPath = storageService.FOLDERS_PATHS.DEFAULT_AVATARS
      const defaultAvatarsUrls = await storageService.getFilesUrl(defaultAvatarsFolderPath)
      return defaultAvatarsUrls
    } catch (error) {
      const errorMessage = (error as Error)?.message ?? "Une erreur est survenue"
      return rejectWithValue(errorMessage)
    }
  })

export const createUser = createAppAsyncThunk(
  "register/createUser",
  async (_, { getState, dispatch }) => {
    const { email, password } = getState().register.user
    await createUserWithEmailAndPassword(firebase.auth, email, password)
    await dispatch(updateUserProfile()).unwrap()
    await dispatch(sendVerificationEmail()).unwrap()
  })

export const updateUserProfile = createAppAsyncThunk(
  "profile/update",
  async (_, { getState }) => {
    const { avatarSrc, username } = getState().register.user
    const currentUser = firebase.auth.currentUser

    if (!currentUser) {
      throw new Error("You must be authenticated")
    }

    return updateProfile(currentUser, {
      photoURL: avatarSrc,
      displayName: username
    })
  })

export const sendVerificationEmail = createAppAsyncThunk(
  "register/sendConfirmationEmail",
  async () => {
    const currentUser = firebase.auth.currentUser

    if (!currentUser) {
      throw new Error("You must be authenticated")
    }

    return sendEmailVerification(currentUser)
  })

export const { completeProfileStep, setPassword } = registerSlice.actions
export const registerReducer = registerSlice.reducer