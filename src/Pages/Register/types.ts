export type RegistrationStep = "EMAIL" | "PROFILE"
export type RegistrationData = {
  email: string,
  password: string,
  nickname: string,
  avatar: string
}