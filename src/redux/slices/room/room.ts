import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { DatabaseRoom, Message, RoomSlice, RoomUsersProfile } from "./types";
import { MessageService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";

export const initialChatState: RoomSlice = {
  currentRoomId: null,
  roomsList: [],
  getRoomUsersProfileRequest: {
    status: "PENDING",
    error: null
  },
  sendMessageRequest: {
    status: "IDLE",
    error: null
  }
}

const roomSlice = createSlice({
  name: "room",
  initialState: initialChatState,
  reducers: {
    setcurrentDisplayedRoom(state, { payload }: PayloadAction<string | null>) {
      state.getRoomUsersProfileRequest.status = "PENDING"
      state.currentRoomId = payload
    },
    initializeRoom(state, { payload }: PayloadAction<DatabaseRoom>) {
      state.roomsList.push({
        ...payload,
        messages: [],
        usersProfile: {},
        unreadMessagesCount: 0
      })
    },
    setRoomMessage(state, { payload }: PayloadAction<{ message: Message, roomId: string }>) {
      const foundRoom = state.roomsList.find((room) => room.id === payload.roomId)!
      foundRoom.messages.push(payload.message)
    },
    setRoomUsersProfile(state, { payload }: PayloadAction<{ usersProfile: RoomUsersProfile, roomId: string }>) {
      const foundRoom = state.roomsList.find((room) => room.id === payload.roomId)!

      foundRoom.usersProfile = payload.usersProfile
      state.getRoomUsersProfileRequest.status = "IDLE"
    },
    setUnreadMessageCount(state, { payload }: PayloadAction<{ count: number | "reset", roomId: string }>) {
      const foundRoom = state.roomsList.find((room) => room.id === payload.roomId)!
      if (payload.count === "reset") {
        foundRoom.unreadMessagesCount = 0
      } else {
        foundRoom.unreadMessagesCount += payload.count
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.pending, (state) => {
      state.sendMessageRequest.status = "PENDING"
      state.sendMessageRequest.error = null
    })
    builder.addCase(sendMessage.fulfilled, (state) => {
      state.sendMessageRequest.status = "IDLE"
    })
    builder.addCase(sendMessage.rejected, (state, { error }) => {
      state.sendMessageRequest.status = "REJECTED"
      state.sendMessageRequest.error = (error as FirebaseError).message
    })
    builder.addCase(disconnectAction, () => initialChatState)
  }
})

export const sendMessage = createAppAsyncThunk(
  "rooms/sendMessage",
  async ({ content, roomId, users }: { content: string, roomId: string, users: string[], }) => {
    return MessageService.add(content, roomId, users)
  })

export const markRoomMessagesAsRead = createAppAsyncThunk(
  "rooms/markRoomMessagesAsRead",
  async (roomId: string, { dispatch }) => {
    await MessageService.markRoomMessagesAsRead(roomId)
    dispatch(setUnreadMessageCount({ roomId, count: "reset" }))
  })

export const {
  setcurrentDisplayedRoom,
  setRoomMessage,
  initializeRoom,
  setRoomUsersProfile,
  setUnreadMessageCount
} = roomSlice.actions
export const roomReducer = roomSlice.reducer
