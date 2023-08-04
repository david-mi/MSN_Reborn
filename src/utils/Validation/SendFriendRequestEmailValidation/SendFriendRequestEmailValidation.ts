import type { UserProfile } from "@/redux/slices/user/types"

const errorsMessages = {
  SAME_EMAIL_THAN_CURRENT_USER: "Vous ne pouvez pas ajouter votre email",
  CONTACT_ALREADY_ADDED: "Ce contact est présent dans votre liste",
} as const

interface ValidateProps {
  emailInput: string,
  currentUserEmail: string
  contactsList: UserProfile[]
}

export class SendFriendRequestEmailValidation {
  public static errorsMessages = errorsMessages

  public static validate = ({ emailInput, contactsList, currentUserEmail }: ValidateProps) => {
    const differentThanCurrentUserEmailValidation = this.validateDifferentThanCurrentUserEmailOrThrow(emailInput, currentUserEmail)

    if (typeof differentThanCurrentUserEmailValidation === "string") {
      return differentThanCurrentUserEmailValidation
    }

    return this.validateFromContactListOrThrow(emailInput, contactsList)
  }

  public static validateFromContactListOrThrow(emailInput: string, contactsList: UserProfile[]) {
    const isEmailInputPresentInContactsList = contactsList.find((contact) => contact.email === emailInput)

    return isEmailInputPresentInContactsList
      ? errorsMessages.CONTACT_ALREADY_ADDED
      : true
  }

  public static validateDifferentThanCurrentUserEmailOrThrow(emailInput: string, currentUserEmail: string) {

    return emailInput === currentUserEmail
      ? errorsMessages.SAME_EMAIL_THAN_CURRENT_USER
      : true
  }
}