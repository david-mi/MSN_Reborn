import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomSlice, Room } from "./types";

export const initialChatState: RoomSlice = {
  current: null,
  roomsList: []
}

const roomSlice = createSlice({
  name: "room",
  initialState: initialChatState,
  reducers: {
    setcurrentDisplayedRoom(state, { payload }: PayloadAction<null | Room>) {
      state.current = payload
    }
  },
})

export const { setcurrentDisplayedRoom } = roomSlice.actions
export const roomReducer = roomSlice.reducer
