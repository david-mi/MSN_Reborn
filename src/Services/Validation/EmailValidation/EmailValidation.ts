export class EmailValidation {
  private static regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  public static errorsMessage = {
    required: "Champ requis",
    invalid: "Saisir un email valide"
  }

  public static validate = (email: string) => {
    if (email === "") {
      return this.errorsMessage.required
    } else {
      const isValid = this.regex.test(email)
      return isValid || this.errorsMessage.invalid
    }
  }
}