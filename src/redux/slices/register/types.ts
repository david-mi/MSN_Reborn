

export type RegistrationStep = "EMAIL" | "PROFILE" | "PASSWORD" | "SEND_CONFIRMATION_EMAIL" | "VERIFIED"
export type ValidationStatus = "IDLE" | "PENDING" | "REJECTED"
export interface InitialState {
  user: {
    email: string
    password: string
    nickname: string
    avatar: string
  }
  step: RegistrationStep,
  submitStatus: ValidationStatus
}