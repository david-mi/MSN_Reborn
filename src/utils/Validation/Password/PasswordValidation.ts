import type { PasswordFormFields } from "@/Components/Register/PasswordForm/types"

const errorsMessages = {
  REQUIRED: "Champ requis",
  INVALID: "Minimum 8 caractères dont au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
  DIFFERENT: "Les mots de passes doivent être identiques"
} as const

export interface PasswordInput {
  inputName: keyof PasswordFormFields
  value: string
}

type PasswordValidationErrorMessage = typeof errorsMessages[keyof typeof errorsMessages]

export class PasswordValidation {
  private regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{6,}$/
  public errorsMessages = errorsMessages
  private password = ""
  private passwordConfirm = ""

  public validate = (password: PasswordInput): true | PasswordValidationErrorMessage => {
    const passwordComplexityValidation = this.validatePasswordComplexity(password.value)

    if (typeof passwordComplexityValidation === "string") {
      return passwordComplexityValidation
    }

    this[password.inputName] = password.value
    return this.validatePasswordsComparaison()
  }

  public validatePasswordComplexity(password: string): true | PasswordValidationErrorMessage {
    if (password === "") {
      return this.errorsMessages.REQUIRED
    } else if (this.regex.test(password) === false) {
      return this.errorsMessages.INVALID
    }

    return true
  }

  private validatePasswordsComparaison(): true | PasswordValidationErrorMessage {
    if (
      this.password !== "" &&
      this.passwordConfirm !== "" &&
      this.password !== this.passwordConfirm
    ) {
      return this.errorsMessages.DIFFERENT
    }

    return true
  }
}