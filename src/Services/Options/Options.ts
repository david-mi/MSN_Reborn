import { defaultOptions } from "@/redux/slices/options/options";
import { Options } from "@/redux/slices/options/types";
import { ref, update, set } from "firebase/database";
import { firebase } from "@/firebase/config";

export class OptionsService {

  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static async set() {
    const userOptionsRef = ref(firebase.database, `/options/${this.currentUser.uid}`)
    return set(userOptionsRef, {
      ...defaultOptions
    })
  }

  static async update(options: Options) {
    const userOptionsRef = ref(firebase.database, `/options/${this.currentUser.uid}`)
    return update(userOptionsRef, options)
  }
}