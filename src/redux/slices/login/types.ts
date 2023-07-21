export type RequestStatus = "IDLE" | "PENDING" | "REJECTED"

export interface LoginSlice {
  submitStatus: RequestStatus
  submitError: string | null
}