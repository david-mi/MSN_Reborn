import styles from "./sendEmailVerification.module.css";
import Button from "@/Components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/Components/Shared/Loader/Loader";
import Instructions from "./Instructions/Instructions";
import { UserService } from "@/Services";
import { setStep } from "@/redux/slices/register/register";

function SendEmailVerification() {
  const dispatch = useAppDispatch()
  const { submitStatus, submitError } = useAppSelector(state => state.register)
  const verifyTimeout = useRef<NodeJS.Timer>()
  const navigate = useNavigate()

  function handleClick() {
    dispatch(sendVerificationEmail())
  }

  async function handleSendVerificationEmail() {
    verifyTimeout.current = setTimeout(async () => {
      clearTimeout(verifyTimeout.current)
      const isUserVerified = UserService.checkIfVerified()

      if (isUserVerified) {
        navigate("/")
      } else {
        handleSendVerificationEmail()
      }
    }, 2000)
  }

  useEffect(() => {
    dispatch(sendVerificationEmail())
      .then(handleSendVerificationEmail)
  }, [])

  return (
    <div className={styles.sendEmailVerification}>
      {submitStatus === "PENDING"
        ? <Loader className={styles.loader} />
        : <Instructions />
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

export default SendEmailVerification;