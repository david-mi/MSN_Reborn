import { Link } from "react-router-dom";
import { GradientLayout, FooterLinks } from "@/Components/Shared";
import LoginForm from "@/Components/Login/LoginForm/LoginForm";
import styles from "./login.module.css";

function Login() {
  return (
    <div className={styles.login} data-testid="login">
      <GradientLayout className={styles.layout}>
        <LoginForm />
        <FooterLinks>
          <Link to="/register">Pas de compte ? Inscrivez-vous</Link>
        </FooterLinks>
      </GradientLayout>
    </div>
  );
}

export default Login;