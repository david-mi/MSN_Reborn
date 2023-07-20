import styles from "./sendEmailVerification.module.css";
import Button from "@/Components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";
import { disconnectMiddleware } from "@/redux/slices/user/user";
import { useEffect, useRef, useState } from "react";
import Loader from "@/Components/Shared/Loader/Loader";
import Instructions from "@/Components/SendEmailVerification/Instructions/Instructions";
import ModaleLayout from "@/Components/Shared/ModaleLayout/ModaleLayout";
import { checkIfVerifiedFromLocalStorage } from "@/redux/slices/user/user";

function SendEmailVerification() {
  const dispatch = useAppDispatch()
  const { submitStatus, submitError } = useAppSelector(state => state.register)
  const [toogleVerifyTimer, setToogleVerifyTimer] = useState(false)
  const verifyIntervals = 2000
  const verifyTimeLimit = 1000 * 60 * 2
  const verifyStartTime = useRef(Date.now())
  const verifyIntervalIdRef = useRef<NodeJS.Timer>()

  function handleClick() {
    dispatch(sendVerificationEmail())
    setToogleVerifyTimer(prev => !prev)
  }

  function handleDisconnect() {
    dispatch(disconnectMiddleware())
  }

  /**
   * Check at regular intervals if user account has been verified
   * 
   * - If user account is verified, navigate to home page
   * - if not, calls the function again
   * - if isVerifyDurationReached has been reached, stop the function calls
   */

  function checkIfUserIsVerifiedAtIntervals() {
    const isVerifyTimeLimitReached = Date.now() - verifyStartTime.current > verifyTimeLimit

    if (verifyIntervalIdRef.current || isVerifyTimeLimitReached) {
      clearInterval(verifyIntervalIdRef.current)

      if (isVerifyTimeLimitReached) return
    }

    verifyIntervalIdRef.current = setInterval(() => {
      dispatch(checkIfVerifiedFromLocalStorage())
    }, verifyIntervals)
  }

  useEffect(() => {
    dispatch(sendVerificationEmail())
      .then(checkIfUserIsVerifiedAtIntervals)

    return () => {
      clearInterval(verifyIntervalIdRef.current)
    }
  }, [])

  return (
    <div className={styles.container} data-testid="send-email-verification">
      <ModaleLayout title="Vérification de l'email">
        <div className={styles.sendEmailVerification}>
          {submitStatus === "PENDING"
            ? <Loader className={styles.loader} size="3rem" />
            : <Instructions />
          }
          <div className={styles.submitButtonContainer}>
            <Button
              // changing key value with reset will 
              key={String(toogleVerifyTimer)}
              title="Renvoyer"
              theme="gradient"
              waitTimer={60}
              data-testid="register-verification-submit-button"
              onClick={handleClick}
            />
            <Button
              title="Déconnexion"
              theme="monochrome"
              onClick={handleDisconnect}
            />
            <small data-testid="register-verification-submit-error">{submitError}</small>
          </div>
        </div>
      </ModaleLayout>
    </div>
  );
}

export default SendEmailVerification;