import FormLayout from "@/Components/Shared/FormLayout/FormLayout"
import Button from "@/Components/Shared/Button/Button"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type { PasswordFormFields } from "./types"
import { PasswordValidation } from "@/utils/Validation/PasswordValidation/PasswordValidation"

const passwordValidation = new PasswordValidation()

function PasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormFields>()
  const dispatch = useAppDispatch()
  const { submitStatus } = useAppSelector(state => state.register)

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || submitStatus === "PENDING"

  async function onSubmit({ password, passwordConfirm }: PasswordFormFields) {
    console.log(password, passwordConfirm)
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="password">Mot de passe :</label>
      <input
        id="password"
        type="password"
        data-testid="register-password-input"
        {...register("password", {
          validate: (value) => passwordValidation.validate({ inputName: "password", value: value })
        })}
      />
      <small data-testid="register-password-error">{errors.password?.message}</small>
      <label htmlFor="password-confirm">Confirmer mot de passe :</label>
      <input
        id="password-confirm"
        type="password"
        data-testid="register-password-confirm-input"
        {...register("passwordConfirm", {
          validate: (value) => passwordValidation.validate({ inputName: "passwordConfirm", value: value })
        })}
      />
      <small data-testid="register-password-confirm-error">{errors.passwordConfirm?.message}</small>
      <hr />
      <Button
        title="Suivant"
        theme="monochrome"
        wait={submitStatus === "PENDING"}
        data-testid="register-password-submit-button"
        disabled={preventFormSubmit}
      />
    </FormLayout>
  )
}

export default PasswordForm