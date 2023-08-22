import { firebase } from "@/firebase/config"
import {
  addDoc,
  collection,
  serverTimestamp,
  DocumentData,
  DocumentSnapshot,
  query,
  where,
  getDocs,
  orderBy,
  endBefore,
  limit,
  doc,
  updateDoc
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
      ? new Date()
      : (unreadRoomMessagesSnapshot.docs[0].data() as DatabaseMessage).createdAt.toDate()
  }

  public static async getStartingDateToObserveMessages(roomId: string, limitAmount: number, dateToStart: Date) {
    const readMessagesQuery = query(
      collection(firebase.firestore, "rooms", roomId, "messages"),
      orderBy("createdAt"),
      endBefore(dateToStart),
      limit(limitAmount)
    )

    const readRoomMessagesSnapshot = await getDocs(readMessagesQuery)

    return readRoomMessagesSnapshot.empty
      ? new Date()
      : (readRoomMessagesSnapshot.docs[0].data() as DatabaseMessage).createdAt.toDate()
  }
}