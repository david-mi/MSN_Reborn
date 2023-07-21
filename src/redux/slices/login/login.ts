import { LoginSlice } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { AuthService, UserService } from "@/Services";
import { LoginFormFields } from "@/Components/Login/LoginForm/types";
import { FirebaseError } from "firebase/app";

export const initialLoginState: LoginSlice = {
  request: {
    status: "IDLE",
    error: null
  }
}

const loginSlice = createSlice({
  name: "user",
  initialState: initialLoginState,
  reducers: {},
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
