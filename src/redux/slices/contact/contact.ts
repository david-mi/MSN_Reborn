import { ContactSlice } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";
import { UserService, ContactService } from "@/Services";
import { DocumentData } from "firebase/firestore";
import { UserProfile } from "../user/types";

export const initialContactState: ContactSlice = {
  contactsProfile: {},
  contactsIds: [],
  usersWhoSentFriendRequest: [],
  getFriendsRequest: {
    status: "PENDING",
    error: null
  },
  getContactsProfile: {
    status: "PENDING",
    error: null
  },
  request: {
    status: "IDLE",
    error: null
  }
}

const contactSlice = createSlice({
  name: "contact",
  initialState: initialContactState,
  reducers: {
    initializeContactsList(state, { payload }: PayloadAction<{ [id: string]: string } | undefined>) {
      if (!payload) return

      for (const contactId in payload) {
        if (state.contactsProfile[contactId] !== undefined) continue

        state.contactsProfile[contactId] = {
          id: contactId,
          roomId: payload[contactId],
          avatarSrc: "",
          displayedStatus: "offline",
          statusBeforeDisconnect: "offline",
          email: "",
          personalMessage: "",
          username: ""
        }
      }
    },
    setContactsIds(state, { payload }: PayloadAction<{ [id: string]: string } | undefined>) {
      state.contactsIds = payload !== undefined
        ? Object.keys(payload)
        : []
    },
    setContactProfile(state, { payload }: PayloadAction<UserProfile>) {
      state.contactsProfile[payload.id] = {
        ...state.contactsProfile[payload.id],
        ...payload
      }
    },
    setContactsError(state, { payload }: PayloadAction<Error>) {
      state.getContactsProfile.error = payload.message
    },
    setContactsLoaded(state) {
      state.getContactsProfile.error = null
      state.getContactsProfile.status = "IDLE"
    }
  },
  extraReducers: (builder) => {
    builder.addCase(sendFriendRequest.pending, (state) => {
      state.request.status = "PENDING"
      state.request.error = null
    })
    builder.addCase(sendFriendRequest.rejected, (state, { error }) => {
      state.request.status = "REJECTED"
      state.request.error = (error as FirebaseError).message
    })
    builder.addCase(sendFriendRequest.fulfilled, (state) => {
      state.request.status = "IDLE"
    })
    builder.addCase(getUsersWhoSentFriendRequest.pending, (state) => {
      state.getFriendsRequest.status = "PENDING"
      state.getFriendsRequest.error = null
    })
    builder.addCase(getUsersWhoSentFriendRequest.rejected, (state, { error }) => {
      state.getFriendsRequest.status = "REJECTED"
      state.getFriendsRequest.error = (error as FirebaseError).message
    })
    builder.addCase(getUsersWhoSentFriendRequest.fulfilled, (state, { payload }) => {
      state.getFriendsRequest.status = "IDLE"
      state.usersWhoSentFriendRequest = payload
    })
    builder.addCase(disconnectAction, () => initialContactState)
  }
})

export const sendFriendRequest = createAppAsyncThunk(
  "contact/sendFriendRequest",
  async (email: string) => {
    let retrievedUserId: string

    try {
      retrievedUserId = await UserService.findByEmailAndGetId(email)
    } catch (error) {
      throw new FirebaseError("404", "Utilisateur non trouvé")
    }

    return ContactService.sendFriendRequest(retrievedUserId)
  })

export const acceptFriendRequest = createAppAsyncThunk(
  "contact/acceptFriendRequest",
  async (requestingUserId: string) => {
    return ContactService.acceptFriendRequest(requestingUserId)
  })

export const denyFriendRequest = createAppAsyncThunk(
  "contact/denyFriendRequest",
  async (requestingUserId: string) => {
    return ContactService.denyFriendRequest(requestingUserId)
  })

export const getUsersWhoSentFriendRequest = createAppAsyncThunk(
  "contact/getUsersWhoSentFriendRequest",
  async (receveidFriendRequestsDocumentData: DocumentData | undefined) => {
    return ContactService.getUsersWhoSentFriendRequest(receveidFriendRequestsDocumentData)
  })

export const contactReducer = contactSlice.reducer
export const {
  setContactsIds,
  setContactProfile,
  setContactsError,
  initializeContactsList,
  setContactsLoaded
} = contactSlice.actions
