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
}