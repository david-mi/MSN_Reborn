import styles from "./login.module.css";
import GradientLayout from "@/Components/Shared/GradientLayout/GradientLayout";
import LoginForm from "@/Components/Login/LoginForm/LoginForm";
import { Link } from "react-router-dom";
import FooterLinks from "@/Components/Shared/FooterLinks/FooterLinks";

function Login() {
  return (
    <div className={styles.login}>
      <GradientLayout>
        <LoginForm />
        <FooterLinks>
          <Link to="/register">Pas de compte ? Inscrivez-vous</Link>
        </FooterLinks>
      </GradientLayout>
    </div>
  );
}

export default Login;