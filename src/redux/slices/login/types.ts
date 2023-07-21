import type { RequestStatus } from "../types"

export interface LoginSlice {
  request: {
    status: RequestStatus
    error: string | null
  }
}