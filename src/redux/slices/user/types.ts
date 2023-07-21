export type AuthenticationState = "PENDING" | "AUTHENTICATED" | "DISCONNECTED"
export type ValidationStatus = "IDLE" | "PENDING" | "REJECTED"
export type DisplayedStatus = "online" | "busy" | "beRightBack" | "away" | "onThePhone" | "outToLunch" | "offline"

export interface UserProfile {
  avatarSrc: string,
  username: string,
  personalMessage: string
  displayedStatus: DisplayedStatus
}

export interface UserState extends UserProfile {
  authState: AuthenticationState
  verified: boolean
  accountVerification: {
    status: ValidationStatus
    error: null | string
  }
  retrieveProfile: {
    status: ValidationStatus
    error: null | string
  }
}