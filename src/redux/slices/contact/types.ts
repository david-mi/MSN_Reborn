import type { RequestStatus } from "../types"
import { UserProfileWithId } from "@/Components/Home/FriendRequestAlert/types"

export interface ContactSlice {
  contactsList: UserProfileWithId[]
  contactsIds: string[]
  friendRequestingUsers: UserProfileWithId[]
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