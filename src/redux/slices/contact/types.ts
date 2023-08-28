import type { RequestStatus } from "../types"
import { UserProfile } from "@/redux/slices/user/types";

export type Contact = UserProfile & { roomId: string }

export interface ContactSlice {
  contactsProfile: {
    [userId: string]: Contact
  }
  contactsIds: string[]
  usersWhoSentFriendRequest: UserProfile[]
  getFriendsRequest: {
    status: RequestStatus
    error: string | null
  }
  getContactsProfile: {
    status: RequestStatus
    error: string | null
  }
  request: {
    status: RequestStatus
    error: string | null
  }
}