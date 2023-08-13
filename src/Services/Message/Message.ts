import { firebase } from "@/firebase/config"
import { addDoc, collection, serverTimestamp, DocumentData, QuerySnapshot, Timestamp } from "firebase/firestore"
import type { Message } from "@/redux/slices/room/types"

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
        createdAt: message.createdAt.toDate().toDateString(),
        updatedAt: message.updatedAt.toDate().toDateString()
      })
    })

    return messages
  }

  public static async add(content: string, roomId: string) {
    const messagesCollectionRef = collection(firebase.firestore, "rooms", roomId, "messages")
    const message = {
      userId: this.currentUser.uid,
      message: content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await addDoc(messagesCollectionRef, message)
  }
}