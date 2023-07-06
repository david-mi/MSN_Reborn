import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"
import { firebase } from "@/firebase/config";

interface UserProfile {
  avatarSrc: string
  username: string
}

export class UserService {
  static setProfile(user: User, profileData: UserProfile) {
    const profilesRef = doc(firebase.firestore, "users", user.uid)

    return setDoc(profilesRef, profileData)
  }

  static deleteAccount(user: User) {
    return user.delete()
  }

  static checkIfVerified() {
    const currentUser = firebase.auth.currentUser!

    return currentUser.emailVerified
  }
}