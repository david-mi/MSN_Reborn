import { Contact } from "@/redux/slices/contact/types";

const errorsMessages = {
  email: {
    REQUIRED: "Champ requis",
    INVALID: "Email invalide",
    NON_SELECTABLE: "Cet email ne peut être choisi"
  },
  roomName: {
    REQUIRED: "Champ requis",
    OUTSIDE_SIZE_RANGE: "Doit comprendre entre 2 et 30 caractères",
  }
} as const

type EmailError = typeof errorsMessages.email[keyof typeof errorsMessages.email];
type roomNameError = typeof errorsMessages.roomName[keyof typeof errorsMessages.roomName];

export class InviteContactToRoomValidation {
  private static ROOM_NAME_MIN_LENGTH = 2
  private static ROOM_NAME_MAX_LENGTH = 30
  public static errorsMessages = errorsMessages

  public static validateRoomName = (roomName: string): true | roomNameError => {
    if (this.checkRoomNameLengthValidity(roomName) === false) {
      return this.errorsMessages.roomName.OUTSIDE_SIZE_RANGE
    }

    return true
  }

  public static checkIfEmailIsNotInCurrentRoom(
    selectedEmail: string,
    contactsOutsideCurrentRoom: Contact[]
  ): true | EmailError {
    const isEmailSelectable = contactsOutsideCurrentRoom.find((contact) => {
      return contact.email === selectedEmail
    })

    return isEmailSelectable
      ? true
      : this.errorsMessages.email.NON_SELECTABLE
  }

  private static checkRoomNameLengthValidity(roomName: string): boolean {
    return (
      roomName.length >= this.ROOM_NAME_MIN_LENGTH &&
      roomName.length <= this.ROOM_NAME_MAX_LENGTH
    )
  }
}