import styles from "./sendEmailVerification.module.css";
import Button from "@/Components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";
import { useEffect, useRef, useState } from "react";
import Loader from "@/Components/Shared/Loader/Loader";
import Instructions from "@/Components/SendEmailVerification/Instructions/Instructions";
import ModaleLayout from "@/Components/Shared/ModaleLayout/ModaleLayout";
import { checkAccountVerification } from "@/redux/slices/user/user";
import { useNavigate } from "react-router-dom";

function SendEmailVerification() {
  const dispatch = useAppDispatch()
  const { submitStatus, submitError } = useAppSelector(state => state.register)
  const isAccountVerified = useAppSelector(({ user }) => user.verified)
  const verifyTimeoutIdRef = useRef<NodeJS.Timer>()
  const [toogleVerifyTimer, setToogleVerifyTimer] = useState(false)
  const navigate = useNavigate()
  const verifyIntervals = 2000
  const verifyTimeLimit = 1000 * 60 * 2
  const verifyStartTime = useRef(Date.now())


  function handleClick() {
    dispatch(sendVerificationEmail())
    setToogleVerifyTimer(prev => !prev)
  }

  /**
   * Check at regular intervals if user account has been verified
   * 
   * - If user account is verified, navigate to home page
   * - if not, calls the function again
   * - if isVerifyDurationReached has been reached, stop the function calls
   */

  function redirectIfUserIsVerified() {
    const isVerifyTimeLimitReached = Date.now() - verifyStartTime.current > verifyTimeLimit

    if (verifyTimeoutIdRef.current || isVerifyTimeLimitReached) {
      clearTimeout(verifyTimeoutIdRef.current)

      if (isVerifyTimeLimitReached) return
    }

    verifyTimeoutIdRef.current = setTimeout(async () => {
      await dispatch(checkAccountVerification())
      console.log("redirectIfUserIsVerified")
      redirectIfUserIsVerified()
    }, verifyIntervals)
  }

  useEffect(() => {
    dispatch(sendVerificationEmail())
      .then(redirectIfUserIsVerified)

    return () => {
      clearTimeout(verifyTimeoutIdRef.current)
    }
  }, [])

  useEffect(() => {
    if (isAccountVerified) {
      navigate("/")
    }
  }, [isAccountVerified])

  return (
    <div className={styles.container} data-testid="send-email-verification">
      <ModaleLayout title="Vérification de l'email">
        <div className={styles.sendEmailVerification}>
          {submitStatus === "PENDING"
            ? <Loader className={styles.loader} />
            : <Instructions />
          }
          <hr />
          <Button
            // changing key value with reset will 
            key={String(toogleVerifyTimer)}
            title="Renvoyer"
            theme="gradient"
            waitTimer={60}
            data-testid="register-verification-submit-button"
            onClick={handleClick}
          />
          <small data-testid="register-verification-submit-error">{submitError}</small>
        </div>
      </ModaleLayout>
    </div>
  );
}

export default SendEmailVerification;