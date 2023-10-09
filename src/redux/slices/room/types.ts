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
  usernameSnapshot: string
  readBy: {
    [userId: string]: boolean
  }
  message: string
}

export interface DatabaseMessage {
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  usernameSnapshot: string
  readBy: {
    [userId: string]: boolean
  }
  message: string
}

export interface NotificationMessage {
  id: string
  roomId: string
  userId: string
  username: string
  message: string
  roomOrContactName: string
  roomOrContactAvatarSrc?: string
}

export interface RoomUsers {
  subscribed: {
    [userId: UserId]: SubscribedUser
  },
  unsubscribed: {
    [userId: UserId]: UnsubscribedUser
  }
}

export interface DatabaseRoomUsers {
  subscribed: {
    [userId: UserId]: SubscribedDatabaseUser
  },
  unsubscribed: {
    [userId: UserId]: UnsubscribedDatabaseUser
  }
}

export interface Room {
  name: null | string
  id: string
  type: RoomType
  users: RoomUsers
  previousMessagesScrollTop: number | null
  nonFriendUsersProfile: RoomUsersProfile
  messages: Message[]
  unreadMessagesCount: number
  oldestRetrievedMessageDate: number | null
  playWizz: boolean
}

export type Role = "user" | "admin"

export interface SubscribedUser {
  role: Role
}

export interface SubscribedDatabaseUser {
  // joinedAt: FieldValue
  role: Role
}

interface UnsubscribedUser {
  // leftAt: number
  username: string
}

interface UnsubscribedDatabaseUser {
  // leftAt: FieldValue
  username: string
}

export type DatabaseRoom = {
  id: string
  name: string | null
  type: RoomType
  users: RoomUsers
}



export type DatabaseCustomRoom = DatabaseRoom & {
  name: string
}

export interface PendingRoomInvitation {
  id: string
  roomId: string
  roomName: string
  roomUsersProfile: {
    [userId: string]: UserProfile
  }
}

export type DataBasePendingRoomInvitation = {
  [userId: string]: DocumentReference<DocumentData>
}

export interface RoomSlice {
  currentRoomId: RoomId | null
  roomsList: {
    [roomId: RoomId]: Room
  }
  messagesToNotify: NotificationMessage[]
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
  leaveRoomRequest: {
    status: RequestStatus,
    error: string | null
  }
  deleteRoomRequest: {
    status: RequestStatus,
    error: string | null
  }
}