import styles from "./login.module.css";
import FormLayout from "@/Components/Shared/FormLayout/FormLayout";
import Avatar from "@/Components/Shared/Avatar/Avatar";
import Button from "@/Components/Shared/Button/Button";
import ModaleLayout from "@/Components/Shared/ModaleLayout/ModaleLayout";

function Login() {
  function handleSubmit() {
    console.log("submit")
  }

  return (
    <div className={styles.login}>
    </div>
  );
}

export default Login;