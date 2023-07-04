import { firebase } from "@/firebase/config";
import { sendEmailVerification, User, createUserWithEmailAndPassword } from "firebase/auth";

export class AuthService {
  public static createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(firebase.auth, email, password)
  }

  public static async sendVerificationEmail(user: User) {
    await sendEmailVerification(user)

    return "Verification email has been sent"
  }
}