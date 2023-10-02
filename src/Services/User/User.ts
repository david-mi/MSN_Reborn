import { reload } from "firebase/auth";
import { firebase } from "@/firebase/config";
import { UserProfile } from "@/redux/slices/user/types";
import { set, ref, update, remove, equalTo, query, orderByChild, get } from "firebase/database";

export class UserService {

  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  static async setProfile(profileData: Pick<UserProfile, "avatarSrc" | "username" | "email">) {
    const profilesRef = ref(firebase.database, `/profiles/${this.currentUser.uid}`)
    return set(profilesRef, {
      ...profileData,
      displayedStatus: "online",
      statusBeforeDisconnect: "online",
      personalMessage: ""
    })
  }

  static async forceRefreshToken() {
    return this.currentUser.getIdToken(true)
  }

  static async checkIfCurrentUserProfileExist() {
    const userProfileRef = ref(firebase.database, `profiles/${this.currentUser.uid}`)
    const userProfileSnapshot = await get(userProfileRef)
    return userProfileSnapshot.exists()
  }

  static async updateProfile(profileData: Partial<UserProfile>) {
    const profilesRef = ref(firebase.database, `/profiles/${this.currentUser.uid}`)
    return update(profilesRef, profileData)
  }

  static async deleteAccount() {
    const profilesRef = ref(firebase.database, `/profiles/${this.currentUser.uid}`)
    await this.currentUser.delete()
    return remove(profilesRef)
  }

  static async checkIfVerified() {
    await reload(this.currentUser)

    return this.currentUser.emailVerified
  }

  public static async findByEmailAndGetId(email: string) {
    const profilesRef = ref(firebase.database, "profiles")

    const findUserByEmailQuery = query(
      profilesRef,
      orderByChild("email"),
      equalTo(email)
    )

    const retrievedUsersSnapShot = await get(findUserByEmailQuery)

    if (retrievedUsersSnapShot.exists() === false) {
      throw new Error("Utilisateur non trouvé")
    }

    return Object.keys(retrievedUsersSnapShot.val())[0]
  }
}