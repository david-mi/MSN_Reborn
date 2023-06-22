import { fetchSignInMethodsForEmail } from "firebase/auth"
import { firebase } from "@/firebase/config"

export class EmailValidation {
  private regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  private unavailableEmails = new Set<string>()
  public errorsMessages = {
    REQUIRED: "Champ requis",
    INVALID: "Saisir un email valide",
    UNAVAILABLE: "Cet email est déjà utilisé"
  }

  public validateFromInput = (email: string) => {
    if (email === "") {
      return this.errorsMessages.REQUIRED
    } else {
      return this.regex.test(email) || this.errorsMessages.INVALID
    }
  }

  public async checkAvailabilityFromDatabase(email: string) {
    const retrievedSignInMethodsForEmail = await fetchSignInMethodsForEmail(firebase.auth, email)

    if (retrievedSignInMethodsForEmail.length > 0) {
      this.unavailableEmails.add(email)
      throw new Error(this.errorsMessages.UNAVAILABLE)
    }
  }

  public validateFromUnavailableList(email: string) {
    return this.unavailableEmails.has(email) && this.errorsMessages.UNAVAILABLE
  }
}