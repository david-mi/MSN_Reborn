import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Options, OptionsSlice } from "./types";
import { createAppAsyncThunk } from "@/redux/types";
import { OptionsService } from "@/Services";
import { FirebaseError } from "firebase/app";

export const defaultOptions: Options = {
  wizzShake: true,
  wizzVolume: 0.5,
  messageNotificationVolume: 0.5
}

export const initialOptionsState: OptionsSlice = {
  user: {
    ...defaultOptions
  },
  request: {
    status: "IDLE",
    error: null
  }
}

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialOptionsState,
  reducers: {
    setStoreOptions(state, { payload }: PayloadAction<Options>) {
      state.user = payload
    }
  },
  extraReducers: (builder => {
    builder.addCase(setOptions.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(setOptions.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(setOptions.rejected, (state, { error }) => {
      state.request.status = "REJECTED"
      state.request.error = (error as FirebaseError).message
    })
    builder.addCase(updateOptions.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(updateOptions.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(updateOptions.rejected, (state, { error }) => {
      state.request.status = "REJECTED"
      state.request.error = (error as FirebaseError).message
    })
  })
})

export const setOptions = createAppAsyncThunk("options/set", () => {
  OptionsService.set()
})

export const updateOptions = createAppAsyncThunk("options/update", (options: Options) => {
  return OptionsService.update(options)
})

export const { setStoreOptions } = notificationSlice.actions
export const optionsReducer = notificationSlice.reducer
