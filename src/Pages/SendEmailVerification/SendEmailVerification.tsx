import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";
import { checkIfUserIsVerified, disconnect } from "@/redux/slices/user/user";
import Loader from "@/Components/Shared/Loader/Loader";
import Instructions from "@/Components/SendEmailVerification/Instructions/Instructions";
import { ModaleLayout, Button } from "@/Components/Shared";
import styles from "./sendEmailVerification.module.css";

function SendEmailVerification() {
  const dispatch = useAppDispatch()
  const request = useAppSelector(({ register }) => register.request)
  const [toogleVerifyTimer, setToogleVerifyTimer] = useState(false)
  const verifyIntervals = 2000
  const verifyTimeLimit = 1000 * 60 * 2
  const verifyStartTime = useRef(Date.now())
  const verifyTimeoutIdRef = useRef<NodeJS.Timer>()
  const isUserVerifiedRef = useRef(false)

  function handleClick() {
    dispatch(sendVerificationEmail())
    setToogleVerifyTimer(prev => !prev)
  }

  function handleDisconnect() {
    dispatch(disconnect())
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

    if (verifyTimeoutIdRef.current || isVerifyTimeLimitReached || isUserVerifiedRef.current) {
      clearTimeout(verifyTimeoutIdRef.current)

      if (isVerifyTimeLimitReached || isUserVerifiedRef.current) return
    }

    verifyTimeoutIdRef.current = setTimeout(async () => {
      isUserVerifiedRef.current = await dispatch(checkIfUserIsVerified())
      checkIfUserIsVerifiedAtIntervals()
    }, verifyIntervals)
  }

  useEffect(() => {
    dispatch(sendVerificationEmail())
      .then(checkIfUserIsVerifiedAtIntervals)

    return () => {
      clearTimeout(verifyTimeoutIdRef.current)
    }
  }, [])

  return (
    <div className={styles.container} data-testid="send-email-verification">
      <ModaleLayout title="Vérification de l'email">
        <div className={styles.sendEmailVerification}>
          {request.status === "PENDING"
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
            <small data-testid="register-verification-submit-error">{request.error}</small>
          </div>
        </div>
      </ModaleLayout>
    </div>
  );
}

export default SendEmailVerification;