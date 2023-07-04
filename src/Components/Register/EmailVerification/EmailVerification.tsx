import styles from "./emailVerification.module.css";
import Button from "@/Components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";

function EmailVerification() {
  const dispatch = useAppDispatch()
  const { submitStatus, submitError } = useAppSelector(state => state.register)

  function handleClick() {
    dispatch(sendVerificationEmail())
  }

  return (
    <div className={styles.emailVerification}>
      <div>
        <h2>Un email de vérification vous a été envoyé</h2>
        <small>pensez à vérifier vos spams</small>
      </div>
      <hr />
      <div>
        <h2>Email non reçu ?</h2>
        <p>Cliquez sur le bouton ci-dessous pour le renvoyer</p>
      </div>
      <hr />
      <small data-testid="register-verification-submit-error">{submitError}</small>
      <Button
        title="Renvoyer"
        theme="gradient"
        wait={submitStatus === "PENDING"}
        disabled={submitStatus === "PENDING"}
        data-testid="register-verification-submit-button"
        onClick={handleClick}
      />
    </div>
  );
}

export default EmailVerification;