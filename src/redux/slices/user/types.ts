export type AuthenticationState = "PENDING" | "AUTHENTICATED" | "DISCONNECTED"
export type ValidationStatus = "IDLE" | "PENDING" | "REJECTED"
export type DisplayedStatus = "online" | "busy" | "beRightBack" | "away" | "onThePhone" | "outToLunch" | "offline"

export interface UserState {
  authState: AuthenticationState
  verified: boolean
  displayedStatus: DisplayedStatus
  accountVerification: {
    status: ValidationStatus,
    error: null | string
  }
}