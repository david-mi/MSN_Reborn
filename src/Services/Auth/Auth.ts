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

export class AuthService {
  public static errorsMessages = {
    EMAIL_UNAVAILABLE: "Cet email est déjà utilisé"
  }

  public static createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(firebase.auth, email, password)
  }

  public static async sendVerificationEmail() {
    const currentUser = firebase.auth.currentUser!
    await reload(currentUser)

    if (currentUser.emailVerified === true) {
      throw new Error("Ce compte est déjà vérifié")
    }

    return sendEmailVerification(currentUser)
  }

  public static async verifyEmail(oobCode: string | null) {
    if (oobCode === null) {
      throw new Error("oobCode is missing")
    }

    return applyActionCode(firebase.auth, oobCode)
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

  static async disconnect() {
    await signOut(firebase.auth)
  }
}