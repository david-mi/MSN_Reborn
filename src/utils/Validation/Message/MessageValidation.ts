const errorsMessages = {
  REQUIRED: "Champ requis"
} as const

type MessageValidationErrorMessage = typeof errorsMessages[keyof typeof errorsMessages]

export class MessageValidation {
  public static errorsMessages = errorsMessages

  public static validateFromInput = (message: string): true | MessageValidationErrorMessage => {
    if (message.trim() === "") {
      return this.errorsMessages.REQUIRED
    }

    return true
  }
}