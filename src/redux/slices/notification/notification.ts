import { DatabaseNotification, NotificationSlice } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { NotificationService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";
import { UserId } from "../room/types";
import type { Notification } from "./types";

export const initialNotificationState: NotificationSlice = {
  list: [],
  request: {
    status: "IDLE",
    error: null
  }
}

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotificationState,
  reducers: {
    setNotifications(state, { payload }: PayloadAction<Notification[]>) {
      state.list = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteNotification.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(deleteNotification.rejected, (state, { error }) => {
      state.request.status = "REJECTED"
      state.request.error = (error as FirebaseError).message
    })
    builder.addCase(deleteNotification.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(addNotification.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(addNotification.rejected, (state, { error }) => {
      state.request.status = "REJECTED"
      state.request.error = (error as FirebaseError).message
    })
    builder.addCase(addNotification.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(disconnectAction, () => initialNotificationState)
  }
})

export const deleteNotification = createAppAsyncThunk(
  "notification/delete",
  async (notificationId: string) => {
    return NotificationService.delete(notificationId)
  }
)

export const addNotification = createAppAsyncThunk(
  "notification/add",
  async ({ notification, usersId }: { notification: DatabaseNotification, usersId: UserId[] }) => {
    return NotificationService.add(notification, usersId)
  }
)

export const { setNotifications } = notificationSlice.actions
export const notificationReducer = notificationSlice.reducer
