import styles from "./sendEmailVerification.module.css";
import Button from "@/Components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { sendVerificationEmail } from "@/redux/slices/register/register";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/Components/Shared/Loader/Loader";
import Instructions from "./Instructions/Instructions";
import { UserService } from "@/Services";

function SendEmailVerification() {
  const dispatch = useAppDispatch()
  const { submitStatus, submitError } = useAppSelector(state => state.register)
  const navigate = useNavigate()
  const verifyTimeoutIdRef = useRef<NodeJS.Timer>()
  const verifyIntervals = 2000
  const verifyTimeLimit = 1000 * 60 * 2
  const verifyStartTime = useRef(Date.now())
  const [toogleVerifyTimer, setToogleVerifyTimer] = useState(false)

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
      clearInterval(verifyTimeoutIdRef.current)

      if (isVerifyTimeLimitReached) return
    }

    verifyTimeoutIdRef.current = setTimeout(async () => {
      const isUserVerified = await UserService.checkIfVerified()

      if (isUserVerified) {
        navigate("/")
      } else {
        redirectIfUserIsVerified()
      }
    }, verifyIntervals)
  }

  useEffect(() => {
    dispatch(sendVerificationEmail())
      .then(redirectIfUserIsVerified)

    return () => {
      clearTimeout(verifyTimeoutIdRef.current)
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
        // changing key value with reset will 
        key={String(toogleVerifyTimer)}
        title="Renvoyer"
        theme="gradient"
        waitTimer={60}
        data-testid="register-verification-submit-button"
        onClick={handleClick}
      />
    </div>
  );
}

export default SendEmailVerification;