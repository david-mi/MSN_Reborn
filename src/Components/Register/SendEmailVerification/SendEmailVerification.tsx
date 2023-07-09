import styles from "./sendEmailVerification.module.css";
import Button from "@/Components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/Components/Shared/Loader/Loader";
import Instructions from "./Instructions/Instructions";
import { UserService } from "@/Services";

function SendEmailVerification() {
  const dispatch = useAppDispatch()
  const { submitStatus, submitError } = useAppSelector(state => state.register)
  const verifyTimeout = useRef<NodeJS.Timer>()
  const verifyTimeoutTimer = 2000
  const verifyStopTimeout = useRef<NodeJS.Timer>()
  const verifyStopTimer = 1000 * 60 * 2
  const navigate = useNavigate()

  function handleClick() {
    dispatch(sendVerificationEmail())
  }

  /**
   * Check after a certain time if the user verified his account
   * 
   * - If user account is verified, navigate to home page
   * - if not, calls the function again
   */

  function handleAccountVerificationCheck() {
    if (verifyTimeout.current) {
      clearInterval(verifyTimeout.current)
    }

    verifyTimeout.current = setTimeout(async () => {
      const isUserVerified = await UserService.checkIfVerified()

      if (isUserVerified) {
        navigate("/")
      } else {
        handleAccountVerificationCheck()
      }
    }, verifyTimeoutTimer)
  }

  /**
   * Stop checking if user is verified after a certain delay to avoid
   * potential infinite api calls
   */

  function handleAccountVerificationCheckStop() {
    if (verifyStopTimeout.current) {
      clearInterval(verifyStopTimeout.current)
    }

    verifyStopTimeout.current = setTimeout(() => {
      clearTimeout(verifyTimeout.current)
    }, verifyStopTimer)
  }

  useEffect(() => {
    dispatch(sendVerificationEmail())
      .then(handleAccountVerificationCheck)
      .then(handleAccountVerificationCheckStop)

    return () => {
      clearTimeout(verifyTimeout.current)
      clearTimeout(verifyStopTimeout.current)
    }
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