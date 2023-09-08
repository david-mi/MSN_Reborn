import { useForm } from "react-hook-form"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { Button, FormLayout, ModaleLayout } from "@/Components/Shared"
import type { InviteContactToRoomFormField } from "./types"
import styles from "./inviteContactToRoomForm.module.css"
import { Contact } from "@/redux/slices/contact/types"
import { InviteContactToRoomValidation } from "@/utils/Validation/InviteContactToRoomValidation/InviteContactToRoomValidation"
import { FirebaseError } from "firebase/app"
import { createCustomRoom, sendNewRoomInvitation } from "@/redux/slices/room/room"
import { UserProfile } from "@/redux/slices/user/types"
import { RoomType } from "@/redux/slices/room/types"

interface Props {
  roomType: RoomType
  toggleInviteContactToRoomForm: () => void
  contactsOutsideCurrentRoom: Contact[]
  currentRoomUsersProfile: Map<string, UserProfile>
}

function InviteContactToRoomForm(props: Props) {
  const { toggleInviteContactToRoomForm, contactsOutsideCurrentRoom, currentRoomUsersProfile, roomType } = props
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm<InviteContactToRoomFormField>()
  const request = useAppSelector(({ contact }) => contact.request)
  const currentRoomId = useAppSelector(({ room }) => room.currentRoomId)
  const hasErrors = Object.keys(errors).length > 0
  const selectedEmail = watch("email")
  const preventFormSubmit = hasErrors || !selectedEmail || request.status === "PENDING"

  async function onSubmit({ email, roomName }: InviteContactToRoomFormField) {
    const userIdToInvite = contactsOutsideCurrentRoom.find((contact) => contact.email === email)!.id

    try {
      if (roomType === "manyToMany") {
        await dispatch(sendNewRoomInvitation({ roomId: currentRoomId as string, userIdToInvite })).unwrap()
      } else {
        const currentRoomContact = currentRoomUsersProfile.values().next().value as UserProfile
        const createdRoomId = await dispatch(createCustomRoom({ name: roomName })).unwrap()
        await dispatch(sendNewRoomInvitation({ roomId: createdRoomId, userIdToInvite: currentRoomContact.id })).unwrap()
        await dispatch(sendNewRoomInvitation({ roomId: createdRoomId, userIdToInvite })).unwrap()
      }

      toggleInviteContactToRoomForm()
    } catch (error) {
      setError("root.submitError", { message: (error as FirebaseError).message })
    }
  }

  return (
    <ModaleLayout
      title="Inviter un contact dans un salon"
      closable
      overlay
      onCloseButtonClick={toggleInviteContactToRoomForm}
    >
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        {roomType !== "manyToMany" && (
          <div>
            <label htmlFor="roomName">Nom de la room :</label>
            <input
              autoFocus
              id="roomName"
              {...register("roomName", { validate: InviteContactToRoomValidation.validateRoomName })}
            />
            <small data-testid="register-email-error">{errors.roomName?.message}</small>
          </div>
        )}
        <div className={styles.selectEmail}>
          <select
            defaultValue="choose"
            id="email"
            {...register("email", {
              validate: (selectedEmail: string) => {
                return InviteContactToRoomValidation.checkIfEmailIsNotInCurrentRoom(
                  selectedEmail,
                  contactsOutsideCurrentRoom
                )
              }
            })}
          >
            <option value="choose" disabled>Choisir contact</option>
            {contactsOutsideCurrentRoom.map(({ email, username, id }) => {
              return <option key={id} value={email}>{username} : ({email})</option>
            })}
          </select>
          <small>{errors.email?.message}</small>
        </div>
        <div className={styles.submitContainer}>
          <Button
            title="Inviter"
            theme="monochrome"
            wait={request.status === "PENDING"}
            disabled={preventFormSubmit}
          />
          <small>{errors.root?.submitError.message}</small>
        </div>
      </FormLayout>
    </ModaleLayout>
  )
}

export default InviteContactToRoomForm

