import { User, reload } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { firebase } from "@/firebase/config";

export interface UserProfile {
  avatarSrc: string
  username: string
}

export class UserService {
  static setProfile(user: User, profileData: UserProfile) {
    const profilesRef = doc(firebase.firestore, "users", user.uid)

    return setDoc(profilesRef, profileData)
  }

  static async getProfile(user: User): Promise<UserProfile> {
    const userProfileRef = doc(firebase.firestore, "users", user.uid)

    const userProfileDoc = await getDoc(userProfileRef)
    return userProfileDoc.data() as UserProfile
  }

  static async deleteAccount(user: User) {
    const userId = user.uid
    const userProfileRef = doc(firebase.firestore, `users/${userId}`)

    await user.delete()
    return deleteDoc(userProfileRef)
  }

  static async checkIfVerified() {
    const currentUser = firebase.auth.currentUser!
    await reload(currentUser)

    return currentUser.emailVerified
  }
}