import { firebase } from "@/firebase/config"
import {
  addDoc,
  collection,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
  Timestamp,
  query,
  where,
  writeBatch,
  getDocs
} from "firebase/firestore"
import type { Message, RoomId } from "@/redux/slices/room/types"

export class MessageService {
  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static getMessagesFromSnapshot(messagesSnapshot: QuerySnapshot<DocumentData>) {
    const messages: Message[] = []
    messagesSnapshot.docs.forEach((doc) => {
      if (doc.metadata.hasPendingWrites) return

      type RetrievedMessage = Omit<Message, "createdAt" | "updatedAt"> & {
        createdAt: Timestamp,
        updatedAt: Timestamp
      }

      const message = doc.data() as RetrievedMessage

      messages.push({
        ...message,
        id: doc.id,
        createdAt: message.createdAt.toMillis(),
        updatedAt: message.updatedAt.toMillis()
      })
    })

    return messages
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
}