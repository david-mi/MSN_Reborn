import { Emulator } from "./Emulator";
import { deleteDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword, sendEmailVerification, applyActionCode, signOut } from "firebase/auth"
import { firebase } from "@/firebase/config"
import { AuthService, UserService } from "@/Services";

export class AuthEmulator extends Emulator {
  static async deleteAllUsers() {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    const fetchUrl = `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts`

    await fetch(fetchUrl, { method: "DELETE" })
  }

  public static async createUser() {
    const email = `mock-user-${crypto.randomUUID()}@email.com`
    const password = "myP@ssworD1234!"

    await createUserWithEmailAndPassword(firebase.auth, email, password)

    return { email, password, currentUser: this.currentUser }
  }

  public static async verifyCurrentUser() {
    await sendEmailVerification(this.currentUser)
    const oobCode = await this.getOobCodeForEmail(this.currentUser.email!)
    await applyActionCode(firebase.auth, oobCode)
  }

  public static async deleteCurrentUser() {
    const userId = this.currentUser.uid
    const userProfileRef = doc(firebase.firestore, `users/${userId}`)

    await this.currentUser.delete()
    await deleteDoc(userProfileRef)
  }

  public static async disconnectCurrentUser() {
    await signOut(firebase.auth)
  }

  public static async getOobCodeForEmail(email: string) {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    const response = await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${projectId}/oobCodes`)
    const oobCodeDetails = await response.json()

    const foundOobDetails = oobCodeDetails.oobCodes.find((details: any) => {
      return (
        details.email === email &&
        details.requestType === "VERIFY_EMAIL"
      )
    })

    return foundOobDetails.oobCode
  }

  public static async createUserAndSetProfile({ verify }: { verify?: boolean } = {}) {
    const email = `mock-user-${crypto.randomUUID()}@email.com`
    const password = "myP@ssworD1234!"
    const username = `user-mock-${crypto.randomUUID()}`
    const avatarSrc = "./random.jpg"

    await AuthService.createUser(email, password)
    await UserService.setProfile({ email, username, avatarSrc })

    if (verify) {
      await this.verifyCurrentUser()
    }

    return { email, username, avatarSrc, password, currentUser: this.currentUser }
  }
}