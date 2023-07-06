import styles from "./emailVerification.module.css";
import Button from "@/Components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";
import { useEffect, useRef } from "react";
import Loader from "@/Components/Shared/Loader/Loader";
import Infos from "./Infos/Infos";
import { UserService } from "@/Services";
import { setStep } from "@/redux/slices/register/register";

function EmailVerification() {
  const dispatch = useAppDispatch()
  const { submitStatus, submitError } = useAppSelector(state => state.register)
  const verifyTimeout = useRef<NodeJS.Timer>()

  function handleClick() {
    dispatch(sendVerificationEmail())
  }

  async function handleSendVerificationEmail() {
    verifyTimeout.current = setTimeout(async () => {
      clearTimeout(verifyTimeout.current)
      const isUserVerified = await UserService.checkIfVerified()

      if (isUserVerified) {
        dispatch(setStep("VERIFIED"))
      } else {
        handleSendVerificationEmail()
      }
    }, 2000)
  }

  useEffect(() => {
    (async function () {
      await dispatch(sendVerificationEmail())
      handleSendVerificationEmail()
    })()

    handleSendVerificationEmail()
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