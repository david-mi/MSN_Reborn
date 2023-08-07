import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatSlice, Room } from "./types";

export const initialChatState: ChatSlice = {
  rooms: [],
  currentDisplayedRoom: null
}

const chatSlice = createSlice({
  name: "contact",
  initialState: initialChatState,
  reducers: {
    setcurrentDisplayedRoom(state, { payload }: PayloadAction<null | Room>) {
      state.currentDisplayedRoom = payload
    }
  },
})

export const { setcurrentDisplayedRoom } = chatSlice.actions
export const chatReducer = chatSlice.reducer
