

export type RegistrationStep = "EMAIL" | "PROFILE" | "PASSWORD"
export type RequestStatus = "IDLE" | "PENDING" | "REJECTED"
export interface RegisterSlice {
  userData: {
    email: string
    password: string
    username: string
    avatarSrc: string
  }
  step: RegistrationStep,
  request: {
    status: RequestStatus
    error: string | null
  },
  defaultAvatars: string[]
  getDefaultAvatarsRequest: {
    status: RequestStatus
    error: string | null
  }
}