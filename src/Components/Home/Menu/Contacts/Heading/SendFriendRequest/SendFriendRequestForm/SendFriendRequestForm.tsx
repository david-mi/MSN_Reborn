import { useForm } from "react-hook-form"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { Button, FormLayout, Loader, ModaleLayout } from "@/Components/Shared"
import type { EmailFormFields } from "@/Components/Register/EmailForm/types"
import { UserService } from "@/Services"
import { sendFriendRequest } from "@/redux/slices/contact/contact"
import { SendFriendRequestEmailValidation, EmailValidation } from "@/utils/Validation"
interface Props {
  toggleSendFriendRequestForm: () => void
}

function SendFriendRequestForm({ toggleSendFriendRequestForm }: Props) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormFields>()
  const request = useAppSelector(({ contact }) => contact.request)
  const contactsList = useAppSelector(({ contact }) => contact.contactsList)

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || request.status === "PENDING"

  async function onSubmit({ email }: EmailFormFields) {
    dispatch(sendFriendRequest(email))
  }

  function handleInputValidation(emailInput: string) {
    return (
      EmailValidation.validateFromInput(emailInput) &&
      SendFriendRequestEmailValidation.validate({
        emailInput,
        contactsList,
        currentUserEmail: UserService.currentUser.email!
      })
    )
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
        <div>
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

