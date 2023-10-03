import { Link } from "react-router-dom";
import { GradientLayout, FooterLinks, Button } from "@/Components/Shared";
import LoginForm from "@/Components/Login/LoginForm/LoginForm";
import styles from "./login.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { authenticateWithGoogle } from "@/redux/slices/login/login";
import OAuthPending from "@/Components/Login/OAuthPending/OAuthPending";

function Login() {
  const dispatch = useAppDispatch()
  const isUsingOAuth = useAppSelector(({ login }) => login.isUsingOAuth)

  async function authWithGoogle() {
    try {
      await dispatch(authenticateWithGoogle()).unwrap()
    }
    catch (error) { }
  }

  if (isUsingOAuth) {
    return <OAuthPending />
  }

  return (
    <div className={styles.login} data-testid="login">
      <GradientLayout className={styles.layout}>
        <LoginForm />
        <FooterLinks>
          <Link to="/register">Inscription (Email / Mot de passe)</Link>
          <Button theme="monochrome" title="Connexion avec Google" onClick={authWithGoogle} />
        </FooterLinks>
      </GradientLayout>
    </div>
  );
}

export default Login;