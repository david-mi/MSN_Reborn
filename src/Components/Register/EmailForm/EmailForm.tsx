import FormLayout from "@/Components/Shared/FormLayout/FormLayout"
import Button from "@/Components/Shared/Button/Button"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { registerEmailMiddleware } from "@/redux/slices/register/register"
import { EmailValidation } from "@/utils/Validation"
import type { EmailFormFields } from "./types"

export const emailValidation = new EmailValidation()

function EmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<EmailFormFields>()
  const dispatch = useAppDispatch()
  const { submitStatus } = useAppSelector(state => state.register)

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || submitStatus === "PENDING"

  async function onSubmit({ email }: EmailFormFields) {
    try {
      await dispatch(registerEmailMiddleware({ email, emailValidation })).unwrap()
    } catch (error) {
      setError("email", { message: error as string })
    }
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Adresse de messagerie :</label>
      <input
        id="email"
        {...register("email", { validate: emailValidation.validateFromInputAndUnavailableList })}
      />
      <small>{errors.email?.message}</small>
      <hr />
      <Button
        title="Suivant"
        theme="monochrome"
        wait={submitStatus === "PENDING"}
        disabled={preventFormSubmit}
      />
    </FormLayout>
  )
}

export default EmailForm