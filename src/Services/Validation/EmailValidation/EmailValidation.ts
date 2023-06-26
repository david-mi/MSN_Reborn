import { fetchSignInMethodsForEmail } from "firebase/auth"
import { firebase } from "@/firebase/config"

const errorsMessages = {
  REQUIRED: "Champ requis",
  INVALID: "Saisir un email valide",
  UNAVAILABLE: "Cet email est déjà utilisé"
} as const

type EmailValidationErrorMessage = typeof errorsMessages[keyof typeof errorsMessages]

export class EmailValidation {
  private regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  public unavailableEmails = new Set<string>()
  public errorsMessages = errorsMessages

  public validateFromInput(email: string): true | EmailValidationErrorMessage {
    if (email === "") {
      return this.errorsMessages.REQUIRED
    } else if (this.regex.test(email) === false) {
      return this.errorsMessages.INVALID
    }

    return true
  }

  /**
   * Check if an email as been added to unavailableEmails list.
   * Helps to avoid unnecessary api calls
   */

  public validateFromUnavailableList(email: string): true | EmailValidationErrorMessage {
    if (this.unavailableEmails.has(email)) {
      return this.errorsMessages.UNAVAILABLE
    }

    return true
  }

  validateFromInputAndUnavailableList = (email: string) => {
    let validationResult = this.validateFromInput(email)

    if (typeof validationResult !== "string") {
      validationResult = this.validateFromUnavailableList(email)
    }

    return validationResult
  }

  /**
   * Check if an email slot is available from database or throws an error
   * - When an email is unavailable, add it to unavailableEmails list
   */

  public async checkAvailabilityFromDatabase(email: string): Promise<true> {
    const retrievedSignInMethodsForEmail = await fetchSignInMethodsForEmail(firebase.auth, email)

    if (retrievedSignInMethodsForEmail.length > 0) {
      this.unavailableEmails.add(email)
      throw new Error(this.errorsMessages.UNAVAILABLE)
    }

    return true
  }
}