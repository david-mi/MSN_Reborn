import { reload } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { firebase } from "@/firebase/config";

export interface UserProfile {
  avatarSrc: string
  username: string
}

export class UserService {
  static setProfile(profileData: UserProfile) {
    const currentUser = firebase.auth.currentUser!
    const profilesRef = doc(firebase.firestore, "users", currentUser.uid)

    return setDoc(profilesRef, profileData)
  }

  static async getProfile(): Promise<UserProfile> {
    const currentUser = firebase.auth.currentUser!
    const userProfileRef = doc(firebase.firestore, "users", currentUser.uid)

    const userProfileDoc = await getDoc(userProfileRef)
    return userProfileDoc.data() as UserProfile
  }

  static async deleteAccount() {
    const currentUser = firebase.auth.currentUser!

    const userId = currentUser.uid
    const userProfileRef = doc(firebase.firestore, `users/${userId}`)

    await currentUser.delete()
    return deleteDoc(userProfileRef)
  }

  static async checkIfVerified() {
    const currentUser = firebase.auth.currentUser!
    await reload(currentUser)

    return currentUser.emailVerified
  }
}