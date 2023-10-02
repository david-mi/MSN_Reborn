import { Link } from "react-router-dom";
import { GradientLayout, FooterLinks, Button } from "@/Components/Shared";
import LoginForm from "@/Components/Login/LoginForm/LoginForm";
import styles from "./login.module.css";
import { useAppDispatch } from "@/redux/hooks";
import { authenticateWithGoogle } from "@/redux/slices/login/login";

function Login() {
  const dispatch = useAppDispatch()

  async function authWithGoogle() {
    try {
      await dispatch(authenticateWithGoogle()).unwrap()
    }
    catch (error) { }
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