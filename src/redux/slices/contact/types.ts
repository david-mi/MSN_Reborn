import type { RequestStatus } from "../types"
import { UserProfileWithId } from "@/Components/Home/FriendRequestAlert/types"

export interface ContactSlice {
  contacts: UserProfileWithId[]
  friendRequestingUsers: UserProfileWithId[]

  getFriendsRequest: {
    status: RequestStatus
    error: string | null
  }

  request: {
    status: RequestStatus
    error: string | null
  }
}