import styles from "./emailVerification.module.css";
import Button from "@/Components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";
import { useEffect } from "react";
import Loader from "@/Components/Shared/Loader/Loader";
import Infos from "./Infos/Infos";

function EmailVerification() {
  const dispatch = useAppDispatch()
  const { submitStatus, submitError } = useAppSelector(state => state.register)

  function handleClick() {
    dispatch(sendVerificationEmail())
  }

  useEffect(() => {
    dispatch(sendVerificationEmail())
  }, [])

  return (
    <div className={styles.emailVerification}>
      {submitStatus === "PENDING"
        ? <Loader className={styles.loader} />
        : <Infos />
      }
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