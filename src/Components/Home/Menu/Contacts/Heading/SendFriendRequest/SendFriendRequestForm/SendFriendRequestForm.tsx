import { useForm } from "react-hook-form"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { Button, FormLayout, ModaleLayout } from "@/Components/Shared"
import type { EmailFormFields } from "@/Components/Register/EmailForm/types"
import { UserService } from "@/Services"
import { sendFriendRequest } from "@/redux/slices/contact/contact"
import { SendFriendRequestEmailValidation, EmailValidation } from "@/utils/Validation"
import styles from "./sendFriendRequestForm.module.css"
import { Contact } from "@/redux/slices/contact/types"

interface Props {
  toggleSendFriendRequestForm: () => void
}

function SendFriendRequestForm({ toggleSendFriendRequestForm }: Props) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormFields>()
  const request = useAppSelector(({ contact }) => contact.request)
  const contactsProfile = useAppSelector(({ contact }) => contact.contactsProfile)

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || request.status === "PENDING"

  async function onSubmit({ email }: EmailFormFields) {
    try {
      await dispatch(sendFriendRequest(email)).unwrap()
      toggleSendFriendRequestForm()
    } catch { }
  }

  function handleInputValidation(emailInput: string) {
    const inputValidation = EmailValidation.validateFromInput(emailInput)

    return typeof inputValidation === "string"
      ? inputValidation
      : SendFriendRequestEmailValidation.validate({
        emailInput,
        contactsList: Object.values<Contact>(contactsProfile),
        currentUserEmail: UserService.currentUser.email!
      })
  }

  return (
    <ModaleLayout
      title="Envoyer une demande de contact"
      closable
      overlay
      onCloseButtonClick={toggleSendFriendRequestForm}
    >
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Adresse de messagerie :</label>
          <input
            autoFocus
            id="email"
            data-testid="send-friend-request-email-input"
            {...register("email", { validate: handleInputValidation })}
          />
          <small data-testid="send-friend-request-email-error">{errors.email?.message}</small>
        </div>
        <div className={styles.submitContainer}>
          <Button
            title="Envoyer"
            theme="monochrome"
            wait={request.status === "PENDING"}
            disabled={preventFormSubmit}
            data-testid="send-contact-request-email-submit-button"
          />
          <small data-testid="send-friend-request-submit-error">{request.error}</small>
        </div>
      </FormLayout>
    </ModaleLayout>
  )
}

export default SendFriendRequestForm

