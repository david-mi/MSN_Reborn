import { doc, deleteField, updateDoc, setDoc } from "firebase/firestore"
import { firebase } from "@/firebase/config"
import { UserId } from "@/redux/slices/room/types"
import { DatabaseNotification } from "@/redux/slices/notification/types"

export class NotificationService {
  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static async delete(notificationId: string) {
    const currentUserNotificationsRef = doc(firebase.firestore, "notifications", this.currentUser.uid)
    return updateDoc(currentUserNotificationsRef, {
      [notificationId]: deleteField()
    })
  }

  public static async add(notification: DatabaseNotification, usersId: UserId[]) {
    for (const userId of usersId) {
      const userNotificationsRef = doc(firebase.firestore, "notifications", userId)

      await setDoc(userNotificationsRef, {
        [crypto.randomUUID()]: notification
      }, { merge: true })
    }
  }
}