import { ContactSlice } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";
import { UserService, ContactService } from "@/Services";
import { DocumentData } from "firebase/firestore";

export const initialContactState: ContactSlice = {
  contacts: [],
  friendRequestingUsers: [],
  getFriendsRequest: {
    status: "PENDING",
    error: null
  },
  request: {
    status: "IDLE",
    error: null
  }
}

const contactSlice = createSlice({
  name: "user",
  initialState: initialContactState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendFriendRequest.pending, (state) => {
      state.sendFriendRequest.status = "PENDING"
      state.sendFriendRequest.error = null
    })
    builder.addCase(sendFriendRequest.rejected, (state, { error }) => {
      state.sendFriendRequest.status = "REJECTED"
      state.sendFriendRequest.error = (error as FirebaseError).message
    })
    builder.addCase(sendFriendRequest.fulfilled, (state) => {
      state.sendFriendRequest.status = "IDLE"
    })
    builder.addCase(disconnectAction, () => initialContactState)
  }
})

export const sendFriendRequest = createAppAsyncThunk(
  "user/sendFriendRequest",
  async (email: string) => {

  })

export const contactReducer = contactSlice.reducer
