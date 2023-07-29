import { UserProfile } from "@/redux/slices/user/types"

export type UserProfileWithId = UserProfile & {
  id: string
}