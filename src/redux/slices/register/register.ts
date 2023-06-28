import type { InitialState } from "./types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit"
import { EmailValidation } from "@/utils/Validation"

const initialState: InitialState = {
  user: {
    email: "",
    password: "",
    nickname: "",
    avatar: ""
  },
  step: "EMAIL",
  submitStatus: "IDLE",
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
  }
})

interface RegisterEmailMiddlewarePayload {
  email: string,
  emailValidation: EmailValidation
}

export const registerEmailMiddleware = createAsyncThunk(
  "register",
  async ({ email, emailValidation }: RegisterEmailMiddlewarePayload, { rejectWithValue }) => {
    try {
      await emailValidation.checkAvailabilityFromDatabase(email)
      return email
    } catch (error) {
      const errorMessage = (error as Error)?.message ?? "Une erreur est survenue"
      return rejectWithValue(errorMessage)
    }
  })

export const registerReducer = registerSlice.reducer