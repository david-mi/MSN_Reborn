import { useRef } from "react"
import { useForm } from "react-hook-form"
import { Button, FormLayout } from "@/Components/Shared"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { registerIfEmailIsAvailable } from "@/redux/slices/register/register"
import { EmailValidation } from "@/utils/Validation"
import type { EmailFormFields } from "./types"
import { AuthService } from "@/Services"

function EmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<EmailFormFields>()
  const dispatch = useAppDispatch()
  const request = useAppSelector(({ register }) => register.request)
  const unavailableEmailsRef = useRef(new Set<string>())

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || request.status === "PENDING"

  async function onSubmit({ email }: EmailFormFields) {
    try {
      await dispatch(registerIfEmailIsAvailable({ email })).unwrap()
    } catch (error) {
      if (error === AuthService.errorsMessages.EMAIL_UNAVAILABLE) {
        unavailableEmailsRef.current.add(email)
      }

      setError("email", { message: error as string })
    }
  }

  function handleInputValidation(email: string) {
    if (unavailableEmailsRef.current.has(email)) {
      return AuthService.errorsMessages.EMAIL_UNAVAILABLE
    }

    return EmailValidation.validateFromInput(email)
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Adresse de messagerie :</label>
        <input
          id="email"
          data-testid="register-email-input"
          {...register("email", { validate: handleInputValidation })}
        />
        <small data-testid="register-email-error">{errors.email?.message}</small>
      </div>
      <Button
        title="Suivant"
        theme="monochrome"
        wait={request.status === "PENDING"}
        disabled={preventFormSubmit}
        data-testid="register-email-submit-button"
      />
    </FormLayout>
  )
}

export default EmailForm