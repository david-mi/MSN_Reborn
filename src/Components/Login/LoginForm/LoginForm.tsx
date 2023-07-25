import { ChangeEvent } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Avatar, Button, Checkbox, SelectDisplayedStatus, FormLayout } from "@/Components/Shared"
import { EmailValidation, PasswordValidation } from "@/utils/Validation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginAndUpdateDisplayStatus } from "@/redux/slices/login/login";
import type { LoginFormFields } from "./types";
import styles from "./loginForm.module.css"

const passwordValidation = new PasswordValidation()

function LoginForm() {
  const loginRequest = useAppSelector(({ login }) => login.request)
  const dispatch = useAppDispatch()
  const useFormRef = useForm<LoginFormFields>({
    defaultValues: {
      "rememberAuth": false,
      "displayedStatus": "online"
    }
  })
  const { register, handleSubmit, setValue, formState: { errors } } = useFormRef
  const hasErrors = Object.keys(errors).length > 0

  function onSubmit(formFields: LoginFormFields) {
    dispatch(loginAndUpdateDisplayStatus(formFields))
  }

  function setRememberAuth({ target }: ChangeEvent<HTMLInputElement>) {
    setValue("rememberAuth", target.checked)
  }

  return (
    <FormProvider {...useFormRef}>
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <Avatar size="medium" className={styles.avatar} />
        <div>
          <label htmlFor="email">Adresse de messagerie :</label>
          <input
            autoFocus
            id="email"
            data-testid="login-email-input"
            {...register("email", { validate: EmailValidation.validateFromInput })}
          />
          <small data-testid="login-email-error">{errors.email?.message}</small>
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            id="password"
            type="password"
            data-testid="login-password-input"
            {...register("password", { validate: passwordValidation.validatePasswordComplexity })}
          />
          <small data-testid="login-password-error">{errors.password?.message}</small>
        </div>
        <SelectDisplayedStatus />
        <div className={styles.rememberAuth}>
          <Checkbox id="rememberAuth" onChange={setRememberAuth} />
          <label htmlFor="rememberAuth">Connexion Automatique</label>
        </div>
        <div className={styles.submitContainer}>
          <Button
            title="Connexion"
            theme="gradient"
            wait={loginRequest.status == "PENDING"}
            disabled={hasErrors}
            data-testid="login-submit-button"
            className={styles.submitButton}
          />
          <small data-testid="login-submit-error">{loginRequest.error}</small>
        </div>
      </FormLayout>
    </FormProvider>
  );
}

export default LoginForm;