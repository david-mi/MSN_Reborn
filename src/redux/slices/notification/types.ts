import { DocumentReference, DocumentData } from "firebase/firestore"
import { RequestStatus } from "../types"

export interface DatabaseNotification {
  target: string,
  content: string
}

export interface Notification extends DatabaseNotification {
  id: string
}

export type DatabaseNotifications = {
  [id: string]: DocumentReference<DocumentData>
}

export interface NotificationSlice {
  list: Notification[]
  request: {
    status: RequestStatus,
    error: string | null
  }
}