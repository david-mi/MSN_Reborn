import { useRef } from "react"
import FormLayout from "@/Components/Shared/FormLayout/FormLayout"
import Button from "@/Components/Shared/Button/Button"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { registerEmailMiddleware } from "@/redux/slices/register/register"
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
  const { submitStatus } = useAppSelector(state => state.register)
  const unavailableEmailsRef = useRef(new Set<string>())

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || submitStatus === "PENDING"

  async function onSubmit({ email }: EmailFormFields) {
    try {
      await dispatch(registerEmailMiddleware({ email })).unwrap()
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
        wait={submitStatus === "PENDING"}
        data-testid="register-email-submit-button"
        disabled={preventFormSubmit}
      />
    </FormLayout>
  )
}

export default EmailForm