import { firebase } from "@/firebase/config"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

export class MessageService {
  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
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