import { ChangeEvent, useEffect } from "react";
import FormLayout from "@/Components/Shared/FormLayout/FormLayout";
import Avatar from "@/Components/Shared/Avatar/Avatar";
import Button from "@/Components/Shared/Button/Button";
import Checkbox from "@/Components/Shared/Checkbox/Checkbox";
import SelectDisplayedStatus from "@/Components/Shared/SelectDisplayedStatus/SelectDisplayedStatus";
import { useForm } from "react-hook-form";
import type { LoginFormFields } from "./types";
import { EmailValidation, PasswordValidation } from "@/utils/Validation";
import { DisplayedStatus } from "@/redux/slices/user/types";
import { loginMiddleware } from "@/redux/slices/user/user";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./loginForm.module.css"

const passwordValidation = new PasswordValidation()

function LoginForm() {
  const { error, status } = useAppSelector(({ user }) => user.login)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginFormFields>({
    defaultValues: {
      "rememberAuth": false,
      "displayedStatus": "online"
    }
  })
  const hasErrors = Object.keys(errors).length > 0

  function onSubmit(formFields: LoginFormFields) {
    dispatch(loginMiddleware(formFields))
  }

  function setRememberAuth({ target }: ChangeEvent<HTMLInputElement>) {
    setValue("rememberAuth", target.checked)
  }

  function setStatus(displayedStatus: DisplayedStatus) {
    setValue("displayedStatus", displayedStatus)
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <Avatar size="medium" className={styles.avatar} />
      <div>
        <label htmlFor="email">Adresse de messagerie :</label>
        <input
          id="email"
          data-testid="login-email-input"
          {...register("email", { validate: EmailValidation.validateFromInput })}
        />
        <small data-testid="login-email-error">{errors.email?.message}</small>
      </div>
      <div className="issou">
        <label htmlFor="password">Mot de passe :</label>
        <input
          id="password"
          type="password"
          data-testid="login-password-input"
          {...register("password", { validate: passwordValidation.validatePasswordComplexity })}
        />
        <small data-testid="login-password-error">{errors.password?.message}</small>
      </div>
      <SelectDisplayedStatus setStatus={setStatus} />
      <div className={styles.rememberAuth}>
        <Checkbox id="rememberAuth" onChange={setRememberAuth} />
        <label htmlFor="rememberAuth">Connexion Automatique</label>
      </div>
      <div className={styles.submitContainer}>
        <Button
          title="Connexion"
          theme="gradient"
          wait={status == "PENDING"}
          disabled={hasErrors}
          data-testid="login-email-submit-button"
          className={styles.submitButton}
        />
        <small data-testid="login-submit-error">{error}</small>
      </div>
    </FormLayout>
  );
}

export default LoginForm;