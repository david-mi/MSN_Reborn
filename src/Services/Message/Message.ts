import { firebase } from "@/firebase/config"
import {
  addDoc,
  collection,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
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

  public static getMessageFromSnapshot(messageSnapshot: QueryDocumentSnapshot<DocumentData>) {
    type RetrievedMessage = Omit<Message, "createdAt" | "updatedAt"> & {
      createdAt: Timestamp,
      updatedAt: Timestamp
    }

    const message = messageSnapshot.data() as RetrievedMessage

    return {
      ...message,
      id: messageSnapshot.id,
      createdAt: message.createdAt.toMillis(),
      updatedAt: message.updatedAt.toMillis()
    }
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
          [userId]: false,
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