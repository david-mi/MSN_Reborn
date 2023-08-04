import type { RequestStatus } from "../types"
import { UserProfile } from "@/redux/slices/user/types";

export interface ContactSlice {
  contactsList: UserProfile[]
  contactsIds: string[]
  usersWhoSentFriendRequest: UserProfile[]
  getFriendsRequest: {
    status: RequestStatus
    error: string | null
  }
  getContactsRequest: {
    status: RequestStatus
    error: string | null
  }
  request: {
    status: RequestStatus
    error: string | null
  }
}