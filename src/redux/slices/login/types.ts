export type RequestStatus = "IDLE" | "PENDING" | "REJECTED"

export interface LoginSlice {
  request: {
    status: RequestStatus
    error: string | null
  }
}