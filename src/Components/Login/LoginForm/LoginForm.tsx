import FormLayout from "@/Components/Shared/FormLayout/FormLayout";
import Avatar from "@/Components/Shared/Avatar/Avatar";
import Button from "@/Components/Shared/Button/Button";
import Checkbox from "@/Components/Shared/Checkbox/Checkbox";
import { useForm } from "react-hook-form";
import type { LoginFormFields } from "./types";
import styles from "./loginForm.module.css"
import { EmailValidation, PasswordValidation } from "@/utils/Validation";
import { ChangeEvent } from "react";

const passwordValidation = new PasswordValidation()

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginFormFields>({
    defaultValues: {
      "rememberAuth": false,
      "status": "online"
    }
  })

  function onSubmit(formFields: LoginFormFields) {
    console.log(formFields)
  }

  function setRememberAuth({ target }: ChangeEvent<HTMLInputElement>) {
    setValue("rememberAuth", target.checked)
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
      <div className={styles.autoConnect}>
        <Checkbox onChange={setRememberAuth} />
        <label htmlFor="autoConnect">Connexion Automatique</label>
      </div>
      <div className={styles.submitContainer}>
        <Button
          title="Connexion"
          theme="gradient"
          wait={false}
          data-testid="login-email-submit-button"
          className={styles.submitButton}
        />
        <small data-testid="login-submit-error">error submit</small>
      </div>
    </FormLayout>
  );
}

export default LoginForm;