import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomSlice, Room } from "./types";

export const initialChatState: RoomSlice = {
  current: null,
  roomsList: [],
  roomsIds: []
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
    setcurrentDisplayedRoom(state, { payload }: PayloadAction<null | Room>) {
      state.current = payload
    }
  },
})

export const { setcurrentDisplayedRoom, setRoomsIds } = roomSlice.actions
export const roomReducer = roomSlice.reducer
