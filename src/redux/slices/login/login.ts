import { LoginSlice } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService } from "@/Services";
import { LoginFormFields } from "@/Components/Login/LoginForm/types";
import { FirebaseError } from "firebase/app";

export const initialLoginState: LoginSlice = {
  submitStatus: "IDLE",
  submitError: null,
}

const loginSlice = createSlice({
  name: "user",
  initialState: initialLoginState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginAndUpdateDisplayStatus.pending, (state) => {
      state.submitStatus = "PENDING"
      state.submitError = null
    })
    builder.addCase(loginAndUpdateDisplayStatus.rejected, (state, { error }) => {
      state.submitStatus = "REJECTED"
      state.submitError = (error as FirebaseError).message
    })
    builder.addCase(loginAndUpdateDisplayStatus.fulfilled, (state) => {
      state.submitStatus = "IDLE"
    })
  }
})

export const loginAndUpdateDisplayStatus = createAppAsyncThunk(
  "user/loginAndUpdateDisplayStatus",
  async (loginData: LoginFormFields) => {
    const { email, password, displayedStatus, rememberAuth } = loginData

    await AuthService.setPersitence(rememberAuth)
    await AuthService.login(email, password)
    await UserService.updateProfile({ displayedStatus })
  })

export const loginReducer = loginSlice.reducer
