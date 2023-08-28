import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { DatabaseRoom, Message, PendingRoomInvitation, RoomSlice, RoomUsersProfile } from "./types";
import { MessageService, RoomService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";
import { UserProfile } from "../user/types";

export const initialChatState: RoomSlice = {
  currentRoomId: null,
  roomsList: {},
  pendingRoomsInvitation: [],
  getRoomNonFriendProfilesRequest: {
    status: "IDLE",
    error: null
  },
  getRoomsRequest: {
    status: "PENDING",
    error: null
  },
  sendMessageRequest: {
    status: "IDLE",
    error: null
  },
  sendNewRoomInvitationRequest: {
    status: "IDLE",
    error: null
  }
}

const roomSlice = createSlice({
  name: "room",
  initialState: initialChatState,
  reducers: {
    setcurrentDisplayedRoom(state, { payload }: PayloadAction<string | null>) {
      // mettre getRoomNonFriendProfilesRequest en pending UNIQUEMENT si c'est une room multiple
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
    setRoomNonContactUsersProfile(state, { payload }: PayloadAction<{ usersProfile: RoomUsersProfile, roomId: string }>) {
      const targetRoom = state.roomsList[payload.roomId]
      targetRoom.usersProfile = {
        ...targetRoom.usersProfile,
        ...payload.usersProfile
      }
      state.getRoomNonFriendProfilesRequest.status = "IDLE"
    },
    removeUserFromRoomNonContactUsersProfile(state, { payload: userId }: PayloadAction<string>) {
      for (const roomId in state.roomsList) {
        const room = state.roomsList[roomId]

        if (room.usersProfile[userId]) {
          delete room.usersProfile[userId]
        }
      }
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
    },
    setRoomUserProfile(state, { payload: userProfile }: PayloadAction<UserProfile>) {
      for (const roomList in state.roomsList) {
        const room = state.roomsList[roomList]
        if (room.users.includes(userProfile.id)) {
          room.usersProfile[userProfile.id] = userProfile
        }
      }
    },
    setRoomsLoaded(state) {
      state.getRoomsRequest.error = null
      state.getRoomsRequest.status = "IDLE"
    },
    setPendingRoomsInvitation(state, { payload }: PayloadAction<PendingRoomInvitation[]>) {
      state.pendingRoomsInvitation = payload
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
    builder.addCase(sendNewRoomInvitation.pending, (state) => {
      state.sendNewRoomInvitationRequest.status = "PENDING"
      state.sendNewRoomInvitationRequest.error = null
    })
    builder.addCase(sendNewRoomInvitation.fulfilled, (state) => {
      state.sendNewRoomInvitationRequest.status = "IDLE"
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

interface SendRoomInvitation {
  requestedUserId: string,
  roomName: string,
  roomInvitationOriginId: string
}

export const sendNewRoomInvitation = createAppAsyncThunk(
  "contact/sendNewRoomInvitation",
  async ({ requestedUserId, roomName, roomInvitationOriginId }: SendRoomInvitation) => {
    return RoomService.sendNewRoomInvitation(requestedUserId, roomName, roomInvitationOriginId)
  })

export const acceptRoomInvitation = createAppAsyncThunk(
  "contact/acceptRoomInvitation",
  async (
    { roomName, roomUsersIds, roomInvitationId }:
      { roomName: string, roomUsersIds: string[], roomInvitationId: string }
  ) => {
    return RoomService.acceptRoomInvitation(roomInvitationId, roomName, roomUsersIds)
  })

export const denyRoomInvitation = createAppAsyncThunk(
  "contact/denyRoomInvitation",
  async (requestingUserId: string) => {
    return RoomService.denyRoomInvitation(requestingUserId)
  })

export const {
  setcurrentDisplayedRoom,
  setRoomMessage,
  initializeRoom,
  setRoomNonContactUsersProfile,
  setUnreadMessageCount,
  editRoomMessage,
  setRoomUserProfile,
  setRoomsLoaded,
  setPendingRoomsInvitation,
  removeUserFromRoomNonContactUsersProfile
} = roomSlice.actions


export const roomReducer = roomSlice.reducer
