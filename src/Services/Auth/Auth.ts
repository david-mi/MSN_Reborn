import { firebase } from "@/firebase/config";
import { sendEmailVerification, User, createUserWithEmailAndPassword, applyActionCode, reload } from "firebase/auth";

export class AuthService {
  public static createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(firebase.auth, email, password)
  }

  public static async sendVerificationEmail(user: User) {
    const currentUser = firebase.auth.currentUser!

    if (currentUser.emailVerified === true) {
      throw new Error("Ce compte est déjà vérifié")
    }

    return sendEmailVerification(user)
  }

  public static async verifyEmail(oobCode: string | null) {
    if (oobCode === null) {
      throw new Error("oobCode is missing")
    }

    return applyActionCode(firebase.auth, oobCode)
  }
}