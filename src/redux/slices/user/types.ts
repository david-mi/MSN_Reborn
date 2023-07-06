export type AuthenticationState = "PENDING" | "AUTHENTICATED" | "DISCONNECTED"
export type ValidationStatus = "IDLE" | "PENDING" | "REJECTED"

export interface UserState {
  authenticated: AuthenticationState
  verified: boolean
  accountVerification: {
    status: ValidationStatus,
    error: null | string
  }
}