const errorsMessages = {
  avatar: {
    REQUIRED: "Un avatar est requis",
    TOO_BIG: "Poids maximum : 200ko",
    WRONG_FORMAT: "Formats acceptés : jp(e)g, png, webp"
  },
  username: {
    REQUIRED: "Champ requis",
    OUTSIDE_SIZE_RANGE: "Doit comprendre entre 2 et 40 caractères",
  },
  personalMessage: {
    TOO_LONG: "Ne doit pas dépasser 80 caractères",
  }
} as const

type AvatarError = typeof errorsMessages.avatar[keyof typeof errorsMessages.avatar];
type UsernameError = typeof errorsMessages.username[keyof typeof errorsMessages.username];

export class ProfileValidation {
  private static AVATAR_MAX_SIZE = 200 * 1024
  private static AVATAR_MIME_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"]
  private static USERNAME_MIN_LENGTH = 2
  private static USERNAME_MAX_LENGTH = 40
  private static PERSONAL_MESSAGE_MAX_LENGTH = 80
  public static errorsMessages = errorsMessages

  public static validateAvatar(avatar: File): true | AvatarError {
    if (this.checkAvatarFormatValidity(avatar) === false) {
      return this.errorsMessages.avatar.WRONG_FORMAT
    } else if (this.checkAvatarSizeValidity(avatar) === false) {
      return this.errorsMessages.avatar.TOO_BIG
    }

    return true
  }

  public static validateUsername = (username: string): true | UsernameError => {
    if (this.checkUserNameLengthValidity(username) === false) {
      return this.errorsMessages.username.OUTSIDE_SIZE_RANGE
    }

    return true
  }

  private static checkUserNameLengthValidity(username: string): boolean {
    return (
      username.length >= this.USERNAME_MIN_LENGTH &&
      username.length <= this.USERNAME_MAX_LENGTH
    )
  }

  private static checkAvatarFormatValidity(avatar: File): boolean {
    return this.AVATAR_MIME_TYPES.includes(avatar.type)
  }

  private static checkAvatarSizeValidity(avatar: File): boolean {
    return avatar.size <= this.AVATAR_MAX_SIZE
  }

  public static validatePersonalMessage = (personalMessage: string) => {
    if (personalMessage.length > this.PERSONAL_MESSAGE_MAX_LENGTH) {
      return this.errorsMessages.personalMessage.TOO_LONG
    }

    return true
  }
}