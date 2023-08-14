import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { DatabaseRoom, Message, RoomSlice, RoomUsersProfile } from "./types";
import { MessageService } from "@/Services";
import { FirebaseError } from "firebase/app";

export const initialChatState: RoomSlice = {
  currentRoomId: null,
  roomsList: [],
  roomsIds: [],
  getRoomsRequest: {
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
    setRoomsIds(state, { payload }: PayloadAction<{ list: string[] } | undefined>) {
      state.roomsIds = payload !== undefined
        ? payload.list
        : []
    },
    setcurrentDisplayedRoom(state, { payload }: PayloadAction<string>) {
      state.currentRoomId = payload
    },
    setRooms(state, { payload }: PayloadAction<Omit<DatabaseRoom, "messages">[]>) {
      state.roomsList = payload.map((room) => {
        return {
          ...room,
          messages: [],
          usersProfile: {}
        }
      })
    },
    setRoomMessages(state, { payload }: PayloadAction<{ messages: Message[], roomId: string }>) {
      const foundRoom = state.roomsList.find((room) => room.id === payload.roomId)!
      foundRoom.messages = payload.messages
    },
    setRoomUsersProfile(state, { payload }: PayloadAction<{ usersProfile: RoomUsersProfile, roomId: string }>) {
      const foundRoom = state.roomsList.find((room) => room.id === payload.roomId)!
      foundRoom.usersProfile = payload.usersProfile
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
  }
})

export const sendMessage = createAppAsyncThunk(
  "rooms/sendMessage",
  async ({ content, roomId }: { content: string, roomId: string }) => {
    return MessageService.add(content, roomId)
  })

export const { setcurrentDisplayedRoom, setRoomsIds, setRoomMessages, setRooms, setRoomUsersProfile } = roomSlice.actions
export const roomReducer = roomSlice.reducer
