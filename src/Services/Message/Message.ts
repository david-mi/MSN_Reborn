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
  limitToLast,
  doc,
  updateDoc
} from "firebase/firestore"
import type { DatabaseMessage, Message, RoomId, RoomUsers } from "@/redux/slices/room/types"

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

  public static async add(content: string, roomId: RoomId, users: RoomUsers) {
    const messagesCollectionRef = collection(firebase.firestore, "rooms", roomId, "messages")

    const readBy: Record<string, boolean> = Object.keys(users.subscribed)
      .reduce((readBy, subscribedUserId) => {
        if (subscribedUserId === this.currentUser.uid) {
          readBy[subscribedUserId] = true
        } else {
          readBy[subscribedUserId] = false
        }

        return readBy
      }, {} as Record<string, boolean>)

    const message = {
      userId: this.currentUser.uid,
      message: content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      readBy
    }

    await addDoc(messagesCollectionRef, message)
  }

  public static async addFromSystem(content: string, roomId: RoomId, relatedUserId?: string) {
    const messagesCollectionRef = collection(firebase.firestore, "rooms", roomId, "messages")

    const message = {
      userId: `system#${relatedUserId ?? this.currentUser.uid}`,
      message: content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      readBy: {}
    }

    await addDoc(messagesCollectionRef, message)
  }

  public static async markRoomMessageAsRead(roomId: string, messageId: string) {
    const messageToMarkAsReadRef = doc(firebase.firestore, "rooms", roomId, "messages", messageId)
    return updateDoc(messageToMarkAsReadRef, {
      [`readBy.${this.currentUser.uid}`]: true
    })
  }

  public static async getOldestUnreadRoomMessageDate(roomId: string) {
    const unreadMessages: Message[] = []

    const unReadMessagesQuery = query(
      collection(firebase.firestore, "rooms", roomId, "messages"),
      where(`readBy.${this.currentUser.uid}`, "==", false),
    )

    const unreadRoomMessagesQuerySnapshot = await getDocs(unReadMessagesQuery)

    unreadRoomMessagesQuerySnapshot.docs.forEach((unreadRoomMessageSnapshot) => {
      const message = unreadRoomMessageSnapshot.data() as DatabaseMessage
      unreadMessages.push({
        ...message,
        id: unreadRoomMessageSnapshot.id,
        createdAt: message.createdAt.toMillis(),
        updatedAt: message.updatedAt.toMillis()
      })
    })

    unreadMessages.sort((nextUnreadMessage, previousUnreadMessage) => {
      return previousUnreadMessage.createdAt - nextUnreadMessage.createdAt
    })

    return unreadMessages.length > 0
      ? new Date(unreadMessages[0].createdAt)
      : new Date()
  }

  public static async getStartingDateToObserveMessages(roomId: string, limitAmount: number, oldestUnreadRoomMessageDate: Date) {
    const readMessagesQuery = query(
      collection(firebase.firestore, "rooms", roomId, "messages"),
      orderBy("createdAt"),
      endBefore(oldestUnreadRoomMessageDate),
      limitToLast(limitAmount)
    )

    const readRoomMessagesSnapshot = await getDocs(readMessagesQuery)

    return readRoomMessagesSnapshot.empty
      ? new Date()
      : (readRoomMessagesSnapshot.docs[0].data() as DatabaseMessage).createdAt.toDate()
  }
}