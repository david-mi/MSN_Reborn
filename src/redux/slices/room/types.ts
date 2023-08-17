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
  readBy: UserId[]
  message: string
}

export interface Room {
  id: string
  type: RoomType
  users: UserId[]
  usersProfile: RoomUsersProfile
  messages: Message[]
}

export type DatabaseRoom = {
  id: string
  type: RoomType
  users: UserId[]
}

export interface RoomSlice {
  currentRoomId: RoomId | null
  roomsList: Room[]
  getRoomUsersProfileRequest: {
    status: RequestStatus,
    error: string | null
  }
  sendMessageRequest: {
    status: RequestStatus,
    error: string | null
  }
}