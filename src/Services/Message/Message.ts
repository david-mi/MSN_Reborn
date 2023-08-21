import { firebase } from "@/firebase/config"
import {
  addDoc,
  collection,
  serverTimestamp,
  DocumentData,
  DocumentSnapshot,
  query,
  where,
  writeBatch,
  getDocs,
  orderBy
} from "firebase/firestore"
import type { DatabaseMessage, Message, RoomId } from "@/redux/slices/room/types"

export class MessageService {
  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static getMessageFromSnapshot(messageSnapshot: DocumentSnapshot<DocumentData>) {
    const message = messageSnapshot.data({ serverTimestamps: "estimate" }) as DatabaseMessage

    return {
      ...message,
      id: messageSnapshot.id,
      createdAt: message.createdAt.toMillis(),
      updatedAt: message.updatedAt.toMillis()
    } as Message
  }

  public static async add(content: string, roomId: RoomId, users: string[]) {
    const messagesCollectionRef = collection(firebase.firestore, "rooms", roomId, "messages")

    const message = {
      userId: this.currentUser.uid,
      message: content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      readBy: users.reduce((readBy, userId) => {
        return {
          ...readBy,
          [userId]: userId === this.currentUser.uid,
        };
      }, {})
    }

    await addDoc(messagesCollectionRef, message)
  }

  public static async markRoomMessagesAsRead(roomId: string) {
    const batch = writeBatch(firebase.firestore)

    const unReadMessagesQuery = query(
      collection(firebase.firestore, "rooms", roomId, "messages"),
      where(`readBy.${this.currentUser.uid}`, "==", false)
    )

    const unReadMessagesQuerySnapshot = await getDocs(unReadMessagesQuery)
    unReadMessagesQuerySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        [`readBy.${this.currentUser.uid}`]: true
      })
    })

    return batch.commit()
  }

  public static async getOldestUnreadRoomMessageDate(roomId: string) {
    const unReadMessagesQuery = query(
      collection(firebase.firestore, "rooms", roomId, "messages"),
      where(`readBy.${this.currentUser.uid}`, "==", false),
      orderBy("createdAt", "asc")
    )

    const unreadRoomMessagesSnapshot = await getDocs(unReadMessagesQuery)
    return unreadRoomMessagesSnapshot.empty
      ? null
      : (unreadRoomMessagesSnapshot.docs[0].data() as DatabaseMessage).createdAt.toDate()
  }
}