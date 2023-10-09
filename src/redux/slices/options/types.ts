import { RequestStatus } from "../types"

export type Options = {
  wizzVolume: number
  wizzShake: boolean
  messageNotificationVolume: number
}

export interface OptionsSlice {
  user: Options
  request: {
    status: RequestStatus,
    error: string | null
  }
}