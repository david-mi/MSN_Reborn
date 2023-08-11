export type RoomType = "oneToOne" | "manyToMany"
export type UserId = string

export interface Message {
  id: string,
  userId: string
  createdAt: Date
  updatedAt: Date
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
  current: Room | null
  roomsList: Room[]
}