import { firebase } from "@/firebase/config"
import { Message } from "@/redux/slices/room/types"
import { addDoc, collection } from "firebase/firestore"

export class MessageService {
  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static async add(message: Omit<Message, "id">, roomId: string) {
    const messagesCollectionRef = collection(firebase.firestore, "rooms", roomId, "messages")

    await addDoc(messagesCollectionRef, message)
  }
}