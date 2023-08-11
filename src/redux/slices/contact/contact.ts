import { Contact, ContactSlice } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/redux/types";
import { FirebaseError } from "firebase/app";
import { disconnectAction } from "../user/user";
import { UserService, ContactService } from "@/Services";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const initialContactState: ContactSlice = {
  contactsList: [],
  contactsIds: [],
  usersWhoSentFriendRequest: [],
  getFriendsRequest: {
    status: "PENDING",
    error: null
  },
  getContactsRequest: {
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
    initializeContactsList(state, { payload }: PayloadAction<Pick<Contact, "roomId" | "id">[]>) {
      state.contactsList = payload.map(({ id, roomId }) => {
        return {
          id,
          roomId,
          avatarSrc: "",
          displayedStatus: "offline",
          email: "",
          personalMessage: "",
          username: ""
        }
      })
    },
    setContactsIds(state, { payload }: PayloadAction<string[]>) {
      state.contactsIds = payload
    },
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
    builder.addCase(getUserContactsIdsAndRoomId.pending, (state) => {
      state.getContactsRequest.status = "PENDING"
      state.getContactsRequest.error = null
    })
    builder.addCase(getUserContactsIdsAndRoomId.rejected, (state, { error }) => {
      state.getContactsRequest.status = "REJECTED"
      state.getContactsRequest.error = (error as FirebaseError).message
    })
    builder.addCase(getUserContactsIdsAndRoomId.fulfilled, (state) => {
      state.getContactsRequest.status = "IDLE"
    })
    builder.addCase(getContactsProfile.pending, (state) => {
      state.getContactsRequest.status = "PENDING"
      state.getContactsRequest.error = null
    })
    builder.addCase(getContactsProfile.rejected, (state, { error }) => {
      state.getContactsRequest.status = "REJECTED"
      state.getContactsRequest.error = (error as FirebaseError).message
    })
    builder.addCase(getContactsProfile.fulfilled, (state, { payload }) => {
      state.getContactsRequest.status = "IDLE"
      state.contactsList = payload.map((contact) => {
        const foundContact = state.contactsList.find((contactsToFind) => contactsToFind.id === contact.id)!
        return {
          ...foundContact,
          ...contact
        }
      })
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

export const getUserContactsIdsAndRoomId = createAppAsyncThunk(
  "contact/getUserContactsIdsAndRoomId",
  async (contactsDocumentData: DocumentData | undefined, { dispatch }) => {
    const { contactsList, contactsId } = await ContactService.getUserContactsIdsAndRoomId(contactsDocumentData)

    dispatch(setContactsIds(contactsId))
    dispatch(initializeContactsList(contactsList))
  })

export const getContactsProfile = createAppAsyncThunk(
  "contact/getContactsProfile",
  async (contactsProfileDocumentData: QueryDocumentSnapshot<DocumentData>[]) => {
    return ContactService.getContactsProfile(contactsProfileDocumentData)
  })

export const contactReducer = contactSlice.reducer
export const { initializeContactsList, setContactsIds } = contactSlice.actions
