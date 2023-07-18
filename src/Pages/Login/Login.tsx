import styles from "./login.module.css";
import GradientLayout from "@/Components/Shared/GradientLayout/GradientLayout";
import LoginForm from "@/Components/Login/LoginForm/LoginForm";

function Login() {
  return (
    <div className={styles.login}>
      <GradientLayout>
        <LoginForm />
      </GradientLayout>
    </div>
  );
}

export default Login;