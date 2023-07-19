import { DisplayedStatus } from "@/redux/slices/user/types"

export interface LoginFormFields {
  email: string
  password: string
  displayedStatus: DisplayedStatus
  rememberAuth: boolean
}