import { Timestamp, DocumentReference, DocumentData } from "firebase/firestore"
import { RequestStatus } from "../types"
import { UserProfile } from "../user/types"

export type RoomType = "oneToOne" | "manyToMany"
export type UserId = string
export type RoomId = string
export type RoomUsersProfile = {
  [id: string]: UserProfile
}

export interface Message {
  id: string,
  userId: string
  createdAt: number
  updatedAt: number
  readBy: {
    [userId: string]: boolean
  }
  message: string
}

export interface DatabaseMessage {
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  readBy: {
    [userId: string]: boolean
  }
  message: string
}

export interface Room {
  id: string
  type: RoomType
  users: UserId[]
  usersProfile: RoomUsersProfile
  messages: Message[]
  unreadMessagesCount: number
}

export type DatabaseRoom = {
  id: string
  type: RoomType
  users: {
    [userId: string]: true
  }
}

export interface PendingRoomInvitation {
  id: string
  roomName: string,
  roomUsersProfile: {
    [userId: string]: UserProfile
  }
}

export type DataBasePendingRoomInvitation = {
  [userId: string]: {
    roomName: string,
    roomInvitationOriginRef: DocumentReference<DocumentData>
  }
}

export interface RoomSlice {
  currentRoomId: RoomId | null
  roomsList: {
    [roomId: RoomId]: Room
  }
  pendingRoomsInvitation: PendingRoomInvitation[]
  getRoomNonFriendProfilesRequest: {
    status: RequestStatus,
    error: string | null
  }
  getRoomsRequest: {
    status: RequestStatus,
    error: string | null
  }
  sendMessageRequest: {
    status: RequestStatus,
    error: string | null
  }
  sendNewRoomInvitationRequest: {
    status: RequestStatus,
    error: string | null
  }
}