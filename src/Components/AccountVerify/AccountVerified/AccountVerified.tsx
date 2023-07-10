import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./accountVerified.module.css";

function AccountVerified() {
  const [redirectTimer, setRedirectTimer] = useState(5)
  const intervalRefId = useRef<NodeJS.Timer>()
  const navigate = useNavigate()

  useEffect(() => {
    intervalRefId.current = setInterval(() => {
      setRedirectTimer((timer) => timer - 1)
    }, 1000)

    return () => {
      clearInterval(intervalRefId.current)
    }
  }, [])

  useEffect(() => {
    if (redirectTimer <= 0) {
      navigate("/")
    }
  }, [redirectTimer])

  return (
    <div className={styles.accountVerified}>
      <h2 className={styles.title}>Compte vérifié</h2>
      <p>Redirection automatique dans <span className={styles.timer}>{redirectTimer}</span></p>
      <p className={styles.redirect}>Cliquez <Link to="/">ici</Link> pour accéder à l'application</p>
    </div>
  );
}

export default AccountVerified;