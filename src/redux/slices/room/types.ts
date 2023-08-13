import { RequestStatus } from "../types"

export type RoomType = "oneToOne" | "manyToMany"
export type UserId = string
type RoomId = string

export interface Message {
  id: string,
  userId: string
  createdAt: string
  updatedAt: string
  readBy: UserId[]
  message: string
}

export interface Room {
  id: string
  type: RoomType
  users: UserId[]
  messages: Message[]
}

export interface RoomSlice {
  currentRoomId: RoomId | null
  roomsList: Room[]
  roomsIds: string[]
  getRoomsRequest: {
    status: RequestStatus,
    error: string | null
  }
  sendMessageRequest: {
    status: RequestStatus,
    error: string | null
  }
}