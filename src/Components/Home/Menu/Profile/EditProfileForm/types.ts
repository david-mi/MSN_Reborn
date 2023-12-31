import { DisplayedStatus } from "@/redux/slices/user/types"

export interface EditProfileFormFields {
  username: string
  avatarSrc: string
  displayedStatus: DisplayedStatus,
  statusBeforeDisconnect: DisplayedStatus,
  personalMessage: string
}