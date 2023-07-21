import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyEmail } from "@/redux/slices/user/user";
import styles from "./accountVerify.module.css";
import Loader from "@/Components/Shared/Loader/Loader";
import ModaleLayout from "@/Components/Shared/ModaleLayout/ModaleLayout";
import AccountVerified from "@/Components/AccountVerify/AccountVerified/AccountVerified";

function AccountVerify() {
  const { status, error } = useAppSelector(({ user }) => user.accountVerificationRequest)
  const dispatch = useAppDispatch()
  const [params] = useSearchParams()
  const oobCode = params.get("oobCode")
  const firstRenderRef = useRef(true)

  const accountVerifyComponents = {
    PENDING: <Loader size={"3rem"} />,
    REJECTED: <small>Erreur: {error}</small>,
    IDLE: <AccountVerified />
  }

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
    } else return

    dispatch(verifyEmail(oobCode))
  }, [])

  return (
    <div className={styles.accountVerify} data-testid="verify-account">
      <ModaleLayout title={"Vérification du compte"}>
        <div className={styles.content}>
          {accountVerifyComponents[status]}
        </div>
      </ModaleLayout>
    </div>
  );
}

export default AccountVerify;