import { useForm } from "react-hook-form"
import { Button, FormLayout } from "@/Components/Shared"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { createUserAndSetProfile, setPassword } from "@/redux/slices/register/register"
import type { PasswordFormFields } from "./types"
import { PasswordValidation } from "@/utils/Validation"
import { setAuthenticationState } from "@/redux/slices/user/user"

const passwordValidation = new PasswordValidation()

function PasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormFields>()
  const dispatch = useAppDispatch()
  const request = useAppSelector(({ register }) => register.request)

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || request.status === "PENDING"

  async function onSubmit({ password }: PasswordFormFields) {
    dispatch(setPassword(password))

    try {
      await dispatch(createUserAndSetProfile()).unwrap()
      dispatch(setAuthenticationState("AUTHENTICATED"))
    } catch (error) { }
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="password">Mot de passe :</label>
        <input
          autoFocus
          id="password"
          type="password"
          data-testid="register-password-input"
          {...register("password", {
            validate: (value) => passwordValidation.validate({ inputName: "password", value: value })
          })}
        />
        <small data-testid="register-password-error">{errors.password?.message}</small>
      </div>
      <div>
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
      </div>
      <div>
        <Button
          title="Suivant"
          theme="monochrome"
          wait={request.status === "PENDING"}
          data-testid="register-password-submit-button"
          disabled={preventFormSubmit}
        />
        <small data-testid="register-password-submit-error">{request.error}</small>
      </div>
    </FormLayout>
  )
}

export default PasswordForm