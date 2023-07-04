export type AuthenticationState = "PENDING" | "AUTHENTICATED" | "DISCONNECTED"

export interface UserState {
  authenticated: AuthenticationState
}