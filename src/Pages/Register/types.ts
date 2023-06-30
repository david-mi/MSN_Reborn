export type RegistrationStep = "EMAIL" | "PROFILE" | "PASSWORD" | "SEND_CONFIRMATION_EMAIL" | "VERIFIED"
export type RegistrationData = {
  email: string,
  password: string,
  username: string,
  avatar: string
}