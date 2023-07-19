import { reload } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import { DisplayedStatus } from "@/redux/slices/user/types";

export interface UserProfile {
  avatarSrc: string
  username: string
  displayedStatus: DisplayedStatus
}

export class UserService {

  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  static setProfile(profileData: Omit<UserProfile, "displayedStatus">) {
    const profilesRef = doc(firebase.firestore, "users", this.currentUser.uid)

    return setDoc(profilesRef, {
      ...profileData,
      displayedStatus: "offline"
    })
  }

  static updateProfile(profileData: Partial<UserProfile>) {
    const userProfileRef = doc(firebase.firestore, "users", this.currentUser.uid)

    return updateDoc(userProfileRef, profileData)
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