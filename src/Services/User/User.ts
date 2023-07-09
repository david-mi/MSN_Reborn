import { reload } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { firebase } from "@/firebase/config";

export interface UserProfile {
  avatarSrc: string
  username: string
}

export class UserService {

  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  static setProfile(profileData: UserProfile) {
    const profilesRef = doc(firebase.firestore, "users", this.currentUser.uid)

    return setDoc(profilesRef, profileData)
  }

  static async getProfile(): Promise<UserProfile> {
    const userProfileRef = doc(firebase.firestore, "users", this.currentUser.uid)

    const userProfileDoc = await getDoc(userProfileRef)
    return userProfileDoc.data() as UserProfile
  }

  static async deleteAccount() {
    const userId = this.currentUser.uid
    const userProfileRef = doc(firebase.firestore, `users/${userId}`)

    await this.currentUser.delete()
    return deleteDoc(userProfileRef)
  }

  static async checkIfVerified() {
    await reload(this.currentUser)

    return this.currentUser.emailVerified
  }
}