import { reload } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, updateDoc, query, collection, where, getDocs } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import { UserProfile } from "@/redux/slices/user/types";

export class UserService {

  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  static setProfile(profileData: Pick<UserProfile, "avatarSrc" | "username" | "email">) {
    const profilesRef = doc(firebase.firestore, "users", this.currentUser.uid)

    return setDoc(profilesRef, {
      ...profileData,
      displayedStatus: "offline",
      personalMessage: ""
    })
  }

  static async forceRefreshToken() {
    return this.currentUser.getIdToken(true)
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

  public static async findByEmailAndGetId(email: string) {
    const findUserByEmailQuery = query(
      collection(firebase.firestore, "users"),
      where("email", "==", email)
    )

    const retrievedUsersSnapShot = await getDocs(findUserByEmailQuery)

    if (retrievedUsersSnapShot.empty) {
      throw new Error("Utilisateur non trouvé")
    }

    return retrievedUsersSnapShot.docs[0].id
  }
}