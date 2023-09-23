import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { DatabaseRoom, Message, PendingRoomInvitation, RoomSlice, RoomUsers, RoomUsersProfile, SubscribedUser, UserId } from "./types";
import { MessageService, NotificationService, RoomService } from "@/Services";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";
import { firebase } from "@/firebase/config";
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
  },
  leaveRoomRequest: {
    status: "IDLE",
    error: null
  },
  deleteRoomRequest: {
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
        messages: [],
        nonFriendUsersProfile: {},
        unreadMessagesCount: 0,
        oldestRetrievedMessageDate: null,
        previousMessagesScrollTop: null
      }
    },
    modifyRoom(state, { payload: roomToEdit }: PayloadAction<DatabaseRoom>) {
      state.roomsList[roomToEdit.id] = {
        ...state.roomsList[roomToEdit.id],
        users: roomToEdit.users,
        name: roomToEdit.name
      }
    },
    setRoomMessage(state, { payload }: PayloadAction<{ message: Message, roomId: string, insertBefore?: boolean }>) {
      const targetRoom = state.roomsList[payload.roomId]
      payload.insertBefore === true
        ? targetRoom.messages.unshift(payload.message)
        : targetRoom.messages.push(payload.message)
    },
    setRoomNonFriendUsersProfile(state, { payload }: PayloadAction<{ nonFriendUsersProfile: RoomUsersProfile, roomId: string }>) {
      const targetRoom = state.roomsList[payload.roomId]
      targetRoom.nonFriendUsersProfile = {
        ...targetRoom.nonFriendUsersProfile,
        ...payload.nonFriendUsersProfile
      }
      state.getRoomNonFriendProfilesRequest.status = "IDLE"
    },
    removeUserFromRoomNonContactUsersProfile(state, { payload: userId }: PayloadAction<string>) {
      for (const roomId in state.roomsList) {
        const room = state.roomsList[roomId]

        if (room.nonFriendUsersProfile[userId]) {
          delete room.nonFriendUsersProfile[userId]
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

      if (foundMessageIndex !== -1) {
        targetRoom.messages[foundMessageIndex] = payload.message
      } else {
        targetRoom.messages.push(payload.message)
      }
    },
    setRoomsLoaded(state) {
      state.getRoomsRequest.error = null
      state.getRoomsRequest.status = "IDLE"
    },
    setPendingRoomsInvitation(state, { payload }: PayloadAction<PendingRoomInvitation[]>) {
      state.pendingRoomsInvitation = payload
    },
    setOldestRoomMessageDate(state, { payload }: PayloadAction<{ roomId: string, date: number }>) {
      const targetRoom = state.roomsList[payload.roomId]
      targetRoom.oldestRetrievedMessageDate = payload.date
    },
    setPreviousScrollTop(state, { payload }: PayloadAction<{ scrollTop: number | null, roomId: string }>) {
      const targetRoom = state.roomsList[payload.roomId]

      // This can be called after room deletion from store
      // so we need to check if room exist
      if (targetRoom) {
        targetRoom.previousMessagesScrollTop = payload.scrollTop
      }
    },
    removeRoom(state, { payload }: PayloadAction<string>) {
      state.currentRoomId = null
      delete state.roomsList[payload]
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
      if (targetRoom.unreadMessagesCount > 0) {
        targetRoom.unreadMessagesCount--
      }
    })
    builder.addCase(sendNewRoomInvitation.pending, (state) => {
      state.sendNewRoomInvitationRequest.status = "PENDING"
      state.sendNewRoomInvitationRequest.error = null
    })
    builder.addCase(sendNewRoomInvitation.fulfilled, (state) => {
      state.sendNewRoomInvitationRequest.status = "IDLE"
    })
    builder.addCase(leaveRoom.pending, (state) => {
      state.leaveRoomRequest.status = "PENDING"
      state.leaveRoomRequest.error = null
    })
    builder.addCase(leaveRoom.fulfilled, (state) => {
      state.leaveRoomRequest.status = "IDLE"
    })
    builder.addCase(leaveRoom.rejected, (state, { error }) => {
      state.leaveRoomRequest.status = "REJECTED"
      state.leaveRoomRequest.error = (error as FirebaseError).message
    })
    builder.addCase(deleteRoom.pending, (state) => {
      state.deleteRoomRequest.status = "PENDING"
      state.deleteRoomRequest.error = null
    })
    builder.addCase(deleteRoom.fulfilled, (state) => {
      state.deleteRoomRequest.status = "IDLE"
    })
    builder.addCase(deleteRoom.rejected, (state, { error }) => {
      state.deleteRoomRequest.status = "REJECTED"
      state.deleteRoomRequest.error = (error as FirebaseError).message
    })
    builder.addCase(disconnectAction, () => initialChatState)
  }
})

export const sendMessage = createAppAsyncThunk(
  "room/sendMessage",
  async ({ content, roomId, users }: { content: string, roomId: string, users: RoomUsers }) => {
    return MessageService.add(content, roomId, users)
  })

export const markRoomMessageAsRead = createAppAsyncThunk(
  "room/markRoomMessageAsRead",
  async ({ roomId, messageId }: { roomId: string, messageId: string }) => {
    await MessageService.markRoomMessageAsRead(roomId, messageId)
    return roomId
  })

interface SendRoomInvitation {
  roomId: string
  userIdToInvite: string
}

export const sendNewRoomInvitation = createAppAsyncThunk(
  "room/sendNewInvitation",
  async ({ roomId, userIdToInvite }: SendRoomInvitation) => {
    return RoomService.sendNewRoomInvitation(roomId, userIdToInvite)
  })

export const acceptRoomInvitation = createAppAsyncThunk(
  "room/acceptInvitation",
  async (
    { roomInvitationId, roomId, username }:
      { roomInvitationId: string, roomId: string, username: string }) => {
    await RoomService.acceptRoomInvitation(roomInvitationId, roomId)
    return MessageService.addFromSystem(`:arrow_join: ${username} a rejoint le salon`, roomId)
  })

export const createCustomRoom = createAppAsyncThunk(
  "room/createCustom",
  async ({ name }: { name: string }) => {
    const currentUserId = firebase.auth.currentUser!.uid

    return RoomService.createRoom("manyToMany", {
      subscribed: {
        [currentUserId]: {
          role: "admin"
        }
      },
      unsubscribed: {}
    }, name)
  })

export const denyRoomInvitation = createAppAsyncThunk(
  "room/denyInvitation",
  async (requestingUserId: string) => {
    return RoomService.denyRoomInvitation(requestingUserId)
  })

export const leaveRoom = createAppAsyncThunk(
  "room/leave",
  async (
    { roomId, username, userToPromote, roomName }:
      { roomId: string, username: string, userToPromote?: UserProfile, roomName: string }, { dispatch }) => {
    await RoomService.leaveRoom(roomId, username)
    const isRoomDeleted = await RoomService.deleteRoomIfEveryMembersUnsubscribed(roomId)

    if (isRoomDeleted === false) {
      await MessageService.addFromSystem(`:arrow_leave: ${username} a quitté le salon`, roomId)
    }

    if (userToPromote) {
      await RoomService.setAdmin(roomId, userToPromote.id)
      NotificationService.add(
        {
          target: roomName,
          content: "Vous avez été promu Administrateur"
        },
        [userToPromote.id]
      )
      MessageService.addFromSystem(`:admin_star: ${userToPromote.username} a été promu Administrateur`, roomId)
    }

    dispatch(removeRoom(roomId))
  })

export const leaveRoomAsAdmin = createAppAsyncThunk(
  "room/leaveAsAdmin",
  async ({ roomId, username }: { roomId: string, username: string }, { dispatch }) => {
    await RoomService.leaveRoom(roomId, username)
    await MessageService.addFromSystem(`:arrow_leave: ${username} a quitté le salon`, roomId)
    dispatch(removeRoom(roomId))
  })

export const deleteRoom = createAppAsyncThunk(
  "room/delete",
  async (
    { roomId, subscribedRoomUsers, roomName }:
      { roomId: string, subscribedRoomUsers: { [userId: UserId]: SubscribedUser }, roomName: string }, { dispatch }) => {
    await RoomService.deleteRoom(roomId)
    await RoomService.deleteRoomMessages(roomId)

    const subscribedUsersIds = Object
      .keys(subscribedRoomUsers)
      .filter((userId) => userId !== firebase.auth.currentUser!.uid)
    NotificationService.add(
      {
        target: roomName,
        content: "Salon supprimé"
      },
      subscribedUsersIds
    )
    dispatch(removeRoom(roomId))
  })

export const {
  setcurrentDisplayedRoom,
  setRoomMessage,
  initializeRoom,
  setRoomNonFriendUsersProfile,
  setUnreadMessageCount,
  editRoomMessage,
  setRoomsLoaded,
  setPendingRoomsInvitation,
  removeUserFromRoomNonContactUsersProfile,
  modifyRoom,
  setOldestRoomMessageDate,
  setPreviousScrollTop,
  removeRoom
} = roomSlice.actions

export const roomReducer = roomSlice.reducer
