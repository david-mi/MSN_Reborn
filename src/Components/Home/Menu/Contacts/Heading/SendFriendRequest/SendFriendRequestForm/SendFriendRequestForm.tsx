import { useRef } from "react"
import { useForm } from "react-hook-form"
import { useAppSelector } from "@/redux/hooks"
import { EmailValidation } from "@/utils/Validation"
import { Button, FormLayout, ModaleLayout } from "@/Components/Shared"
import type { EmailFormFields } from "@/Components/Register/EmailForm/types"
import { AuthService } from "@/Services"

interface Props {
  toggleSendContactRequestForm: () => void
}

function SendFriendRequestForm({ toggleSendContactRequestForm }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // setError
  } = useForm<EmailFormFields>()
  // const dispatch = useAppDispatch()
  const request = useAppSelector(({ register }) => register.request)
  const unavailableEmailsRef = useRef(new Set<string>())

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || request.status === "PENDING"

  async function onSubmit({ email }: EmailFormFields) {
    console.log(email)
    // try {
    //   await dispatch(registerIfEmailIsAvailable({ email })).unwrap()
    // } catch (error) {
    //   if (error === AuthService.errorsMessages.EMAIL_UNAVAILABLE) {
    //     unavailableEmailsRef.current.add(email)
    //   }

    //   setError("email", { message: error as string })
    // }
  }

  function handleInputValidation(email: string) {
    if (unavailableEmailsRef.current.has(email)) {
      return AuthService.errorsMessages.EMAIL_UNAVAILABLE
    }

    return EmailValidation.validateFromInput(email)
  }


  return (
    <ModaleLayout
      title="Envoyer une demande de contact"
      closable
      overlay
      onCloseButtonClick={toggleSendContactRequestForm}
    >
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Adresse de messagerie :</label>
          <input
            autoFocus
            id="email"
            data-testid="send-contact-request-email-input"
            {...register("email", { validate: handleInputValidation })}
          />
          <small data-testid="send-contact-request-email-error">{errors.email?.message}</small>
        </div>
        <Button
          title="Envoyer"
          theme="monochrome"
          wait={request.status === "PENDING"}
          disabled={preventFormSubmit}
          data-testid="send-contact-request-email-submit-button"
        />
      </FormLayout>
    </ModaleLayout>
  )
}

export default SendFriendRequestForm

