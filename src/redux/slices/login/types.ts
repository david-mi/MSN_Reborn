import type { RequestStatus } from "../types"

export interface LoginSlice {
  isUsingOAuth: boolean
  request: {
    status: RequestStatus
    error: string | null
  }
}