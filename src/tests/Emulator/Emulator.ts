import { firebase } from "@/firebase/config"

export class Emulator {
  protected static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }
}