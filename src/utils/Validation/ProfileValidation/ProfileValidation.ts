const errorsMessages = {
  avatar: {
    REQUIRED: "Un avatar est requis",
    TOO_BIG: "Poids maximum : 200ko",
    WRONG_FORMAT: "Formats acceptés : jp(e)g, png, webp"
  },
  username: {
    REQUIRED: "Champ requis",
    OUTSIDE_SIZE_RANGE: "Doit comprendre entre 2 et 40 caractères",
  }
} as const

type AvatarError = typeof errorsMessages.avatar[keyof typeof errorsMessages.avatar];
type UsernameError = typeof errorsMessages.username[keyof typeof errorsMessages.username];

export class ProfileValidation {
  private AVATAR_MAX_SIZE = 200 * 1024
  private AVATAR_MIME_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"]
  private USERNAME_MIN_LENGTH = 2
  private USERNAME_MAX_LENGTH = 40
  public errorsMessages = errorsMessages

  public validateAvatar(avatar: File): true | AvatarError {
    if (this.checkAvatarFormatValidity(avatar) === false) {
      return this.errorsMessages.avatar.WRONG_FORMAT
    } else if (this.checkAvatarSizeValidity(avatar) === false) {
      return this.errorsMessages.avatar.TOO_BIG
    }

    return true
  }

  public validateUsername(username: string): true | UsernameError {
    if (this.checkUserNameLengthValidity(username) === false) {
      return this.errorsMessages.username.OUTSIDE_SIZE_RANGE
    }

    return true
  }

  private checkUserNameLengthValidity(username: string): boolean {
    return (
      username.length >= this.USERNAME_MIN_LENGTH &&
      username.length <= this.USERNAME_MAX_LENGTH
    )
  }

  private checkAvatarFormatValidity(avatar: File): boolean {
    return this.AVATAR_MIME_TYPES.includes(avatar.type)
  }

  private checkAvatarSizeValidity(avatar: File): boolean {
    return avatar.size <= this.AVATAR_MAX_SIZE
  }
}