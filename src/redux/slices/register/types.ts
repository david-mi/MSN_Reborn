

export type RegistrationStep = "EMAIL" | "PROFILE" | "PASSWORD"
export type ValidationStatus = "IDLE" | "PENDING" | "REJECTED"
export interface ProfileState {
  user: {
    email: string
    password: string
    username: string
    avatarSrc: string
  }
  step: RegistrationStep,
  submitStatus: ValidationStatus
  submitError: null | string
  profile: {
    defaultAvatars: string[]
    getDefaultAvatarsStatus: ValidationStatus
    getDefaultAvatarsError: null | string
  }
}