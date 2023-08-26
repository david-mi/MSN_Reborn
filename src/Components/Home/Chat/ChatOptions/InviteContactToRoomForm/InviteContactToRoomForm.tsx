import { useForm } from "react-hook-form"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { Button, FormLayout, ModaleLayout } from "@/Components/Shared"
import type { InviteContactToRoomFormField } from "./types"
import styles from "./inviteContactToRoomForm.module.css"
import { Contact } from "@/redux/slices/contact/types"

interface Props {
  toggleInviteContactToRoomForm: () => void
  contactsOutsideCurrentRoom: Contact[]
}

function InviteContactToRoomForm({ toggleInviteContactToRoomForm, contactsOutsideCurrentRoom }: Props) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<InviteContactToRoomFormField>()
  const request = useAppSelector(({ contact }) => contact.request)
  const hasErrors = Object.keys(errors).length > 0
  const selectedEmail = watch("email")
  const preventFormSubmit = !selectedEmail || hasErrors || request.status === "PENDING"

  async function onSubmit({ email }: InviteContactToRoomFormField) {
    try {
      // await dispatch().unwrap()
      console.log(email)
      toggleInviteContactToRoomForm()
    } catch { }
  }

  function handleInputValidation(selectedEmail: string) {
    return (
      console.log("validation")
      // EmailValidation.validateFromInput(selectedEmail) &&
      // SendFriendRequestEmailValidation.validate({
      //   emailInput: selectedEmail,
      //   contactsList,
      //   currentUserEmail: UserService.currentUser.email!
      // })
    )
  }

  return (
    <ModaleLayout
      title="Inviter un contact dans un salon"
      closable
      overlay
      onCloseButtonClick={toggleInviteContactToRoomForm}
    >
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.selectEmail}>
          <select
            autoFocus
            defaultValue="choose"
            id="email"
            {...register("email", { onChange: handleInputValidation })}
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
          <small>{request.error}</small>
        </div>
      </FormLayout>
    </ModaleLayout>
  )
}

export default InviteContactToRoomForm

