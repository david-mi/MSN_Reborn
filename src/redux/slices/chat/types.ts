import { UserProfile } from "../user/types"

interface Message {
  id: string,
  userId: string,
  content: string,
  createdAt: string
}

export interface Room {
  id: string,
  users: UserProfile[],
  messages: Message[]
}

export interface ChatSlice {
  rooms: Room[]
  currentDisplayedRoom: Room | null
}