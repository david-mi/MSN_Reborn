import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./OAuthPending.module.css";
import { Loader, ModaleLayout } from "@/Components/Shared";
import { setIsUsingOAuth, resetRequestState } from "@/redux/slices/login/login";

function OAuthPending() {
  const dispatch = useAppDispatch()
  const loginRequest = useAppSelector(({ login }) => login.request)
  const isRequestPending = loginRequest.status === "PENDING"
  const hasError = loginRequest.error !== null

  function handleCloseModale() {
    dispatch(setIsUsingOAuth(false))
    dispatch(resetRequestState())
  }

  return (
    <div className={styles.container}>
      <ModaleLayout
        title="Authentification"
        closable={isRequestPending === false || hasError}
        onCloseButtonClick={handleCloseModale}
      >
        <div className={styles.OAuthPending}>
          {isRequestPending && (
            <>
              <h2>En attente...</h2>
              <Loader size="5rem" />
            </>
          )}
          <small>{loginRequest.error}</small>
        </div>
      </ModaleLayout>
    </div>
  );
}

export default OAuthPending;