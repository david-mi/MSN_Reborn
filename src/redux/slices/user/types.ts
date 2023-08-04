import type { RequestStatus } from "../types"

export type AuthenticationState = "PENDING" | "AUTHENTICATED" | "DISCONNECTED"
export type DisplayedStatus = "online" | "busy" | "beRightBack" | "away" | "onThePhone" | "outToLunch" | "offline"

export interface UserProfile {
  id: string
  email: string
  avatarSrc: string,
  username: string,
  personalMessage: string
  displayedStatus: DisplayedStatus
}

export interface UserSlice extends UserProfile {
  authState: AuthenticationState
  verified: boolean
  accountVerificationRequest: {
    status: RequestStatus
    error: null | string
  }
  getProfileRequest: {
    status: RequestStatus
    error: null | string
  }
  editProfileRequest: {
    status: RequestStatus
    error: null | string
  }
}