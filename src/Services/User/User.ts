import { reload } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, updateDoc, query, collection, where, getDocs } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import { DisplayedStatus, UserProfile } from "@/redux/slices/user/types";
import { set, ref, get } from "firebase/database";

export class UserService {

  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  static async setProfile(profileData: Pick<UserProfile, "avatarSrc" | "username" | "email">) {
    const profilesRef = doc(firebase.firestore, "users", this.currentUser.uid)

    await setDoc(profilesRef, {
      ...profileData,
      displayedStatus: "online",
      personalMessage: ""
    })

    return this.setSavedStatus("online")
  }

  static async forceRefreshToken() {
    return this.currentUser.getIdToken(true)
  }

  static async updateProfile(profileData: Partial<UserProfile>) {
    const userProfileRef = doc(firebase.firestore, "users", this.currentUser.uid)

    await updateDoc(userProfileRef, profileData)

    if (profileData.displayedStatus) {
      await this.setSavedStatus(profileData.displayedStatus)
    }
  }

  private static async setSavedStatus(statusToSave: DisplayedStatus) {
    const savedStatusRef = ref(firebase.database, `/status/${this.currentUser.uid}/saved`)

    return set(savedStatusRef, statusToSave)
  }

  static async getProfile(): Promise<UserProfile> {
    const userProfileRef = doc(firebase.firestore, "users", this.currentUser.uid)

    const userProfileDoc = await getDoc(userProfileRef)
    return {
      ...userProfileDoc.data(),
      id: userProfileDoc.id
    } as UserProfile
  }

  static async getSavedStatus(): Promise<DisplayedStatus> {
    const savedStatusRef = ref(firebase.database, `/status/${this.currentUser.uid}/saved`)
    const savedStatusSnapshot = await get(savedStatusRef)
    return savedStatusSnapshot.val()
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