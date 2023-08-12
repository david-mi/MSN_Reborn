import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { RoomSlice } from "./types";
import { MessageService, RoomService } from "@/Services";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export const initialChatState: RoomSlice = {
  current: null,
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
      const foundRoom = state.roomsList.find((room) => room.id === payload)
      state.current = foundRoom
        ? foundRoom
        : null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRooms.pending, (state) => {
      state.getRoomsRequest.status = "PENDING"
      state.getRoomsRequest.error = null
    })
    builder.addCase(getRooms.fulfilled, (state, { payload }) => {
      state.getRoomsRequest.status = "IDLE"
      state.roomsList = payload
    })
    builder.addCase(getRooms.rejected, (state, { error }) => {
      state.getRoomsRequest.status = "REJECTED"
      state.getRoomsRequest.error = (error as FirebaseError).message
    })
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

export const getRooms = createAppAsyncThunk(
  "rooms/getRooms",
  async (roomsQuerySnapshot: QueryDocumentSnapshot<DocumentData>[]) => {
    return RoomService.getRooms(roomsQuerySnapshot)
  })

export const sendMessage = createAppAsyncThunk(
  "rooms/sendMessage",
  async ({ content, roomId }: { content: string, roomId: string }) => {
    return MessageService.add(content, roomId)
  })

export const { setcurrentDisplayedRoom, setRoomsIds } = roomSlice.actions
export const roomReducer = roomSlice.reducer
