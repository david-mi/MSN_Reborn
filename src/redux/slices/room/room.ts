import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { DatabaseRoom, Message, RoomSlice, RoomUsersProfile } from "./types";
import { MessageService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";

export const initialChatState: RoomSlice = {
  currentRoomId: null,
  roomsList: {},
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
      const roomId = payload.id

      state.roomsList[roomId] = {
        ...payload,
        users: Object.keys(payload.users),
        messages: [],
        usersProfile: {},
        unreadMessagesCount: 0
      }
    },
    setRoomMessage(state, { payload }: PayloadAction<{ message: Message, roomId: string }>) {
      const targetRoom = state.roomsList[payload.roomId]
      targetRoom.messages.push(payload.message)
    },
    setRoomUsersProfile(state, { payload }: PayloadAction<{ usersProfile: RoomUsersProfile, roomId: string }>) {
      const targetRoom = state.roomsList[payload.roomId]
      targetRoom.usersProfile = payload.usersProfile
      state.getRoomUsersProfileRequest.status = "IDLE"
    },
    setUnreadMessageCount(state, { payload }: PayloadAction<{ count: number | "reset", roomId: string }>) {
      const targetRoom = state.roomsList[payload.roomId]

      if (payload.count === "reset") {
        targetRoom.unreadMessagesCount = 0
      } else {
        targetRoom.unreadMessagesCount += payload.count
      }
    },
    setReadRoomMessages(state, { payload }: PayloadAction<{ messages: Message[], roomId: string }>) {
      const targetRoom = state.roomsList[payload.roomId]

      targetRoom.messages.unshift(...payload.messages)
    },
    editRoomMessage(state, { payload }: PayloadAction<{ message: Message, roomId: string }>) {
      const targetRoom = state.roomsList[payload.roomId]
      const foundMessageIndex = targetRoom.messages.findIndex((message) => message.id === payload.message.id)!

      targetRoom.messages[foundMessageIndex] = payload.message
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
    builder.addCase(markRoomMessageAsRead.fulfilled, (state, { payload: roomId }: PayloadAction<string>) => {
      const targetRoom = state.roomsList[roomId]
      targetRoom.unreadMessagesCount--
    })
    builder.addCase(disconnectAction, () => initialChatState)
  }
})

export const sendMessage = createAppAsyncThunk(
  "rooms/sendMessage",
  async ({ content, roomId, users }: { content: string, roomId: string, users: string[], }) => {
    return MessageService.add(content, roomId, users)
  })

export const markRoomMessageAsRead = createAppAsyncThunk(
  "rooms/markRoomMessageAsRead",
  async ({ roomId, messageId }: { roomId: string, messageId: string }) => {
    await MessageService.markRoomMessageAsRead(roomId, messageId)
    return roomId
  })

export const {
  setcurrentDisplayedRoom,
  setRoomMessage,
  initializeRoom,
  setRoomUsersProfile,
  setUnreadMessageCount,
  editRoomMessage
} = roomSlice.actions
export const roomReducer = roomSlice.reducer
