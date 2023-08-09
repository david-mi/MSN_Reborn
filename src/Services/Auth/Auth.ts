import { firebase } from "@/firebase/config";
import {
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  applyActionCode,
  reload,
  fetchSignInMethodsForEmail,
  setPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  signOut
} from "firebase/auth";
import { UserService } from "..";
import { ref, remove } from "firebase/database";

export class AuthService {
  public static errorsMessages = {
    EMAIL_UNAVAILABLE: "Cet email est déjà utilisé"
  }

  static get currentUser() {
    const currentUser = firebase.auth.currentUser

    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(firebase.auth, email, password)
  }

  public static async sendVerificationEmail() {
    await reload(this.currentUser)

    if (this.currentUser.emailVerified === true) {
      throw new Error("Ce compte est déjà vérifié")
    }

    return sendEmailVerification(this.currentUser)
  }

  public static async verifyEmail(oobCode: string | null) {
    if (oobCode === null) {
      throw new Error("oobCode is missing")
    }

    await applyActionCode(firebase.auth, oobCode)

    try {
      await UserService.forceRefreshToken()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Check if an email slot is available from database or throws an error
   * - When an email is unavailable, add it to unavailableEmails list
   */

  public static async checkDatabaseEmailAvailability(email: string): Promise<true> {
    const retrievedSignInMethodsForEmail = await fetchSignInMethodsForEmail(firebase.auth, email)

    if (retrievedSignInMethodsForEmail.length > 0) {
      throw new Error(this.errorsMessages.EMAIL_UNAVAILABLE)
    }

    return true
  }

  public static async setPersitence(rememberAuth: boolean) {
    const chosenPersitence = rememberAuth
      ? indexedDBLocalPersistence
      : browserSessionPersistence

    setPersistence(firebase.auth, chosenPersitence)
  }

  public static async login(email: string, password: string) {
    return signInWithEmailAndPassword(firebase.auth, email, password)
  }

  public static async getUserAuthTimeToNumber() {
    const userTokenResult = await this.currentUser.getIdTokenResult()
    return new Date(userTokenResult.authTime).getTime()
  }

  static async disconnect() {
    const userAuthTimeToNumber = await this.getUserAuthTimeToNumber()
    const userDatabaseSavedStatusRef = ref(firebase.database, `/status/${this.currentUser.uid}/entries/${userAuthTimeToNumber}`)

    await remove(userDatabaseSavedStatusRef)
    return signOut(firebase.auth)
  }
}