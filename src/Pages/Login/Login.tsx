import styles from "./login.module.css";
import FormLayout from "@/Components/Shared/FormLayout/FormLayout";
import Avatar from "@/Components/Shared/Avatar/Avatar";
import Button from "@/Components/Shared/Button/Button";
import GradientLayout from "@/Components/Shared/GradientLayout/GradientLayout";
import Checkbox from "@/Components/Shared/Checkbox/Checkbox";

function Login() {
  function handleSubmit() {
    console.log("submit")
  }

  return (
    <div className={styles.login}>

      <GradientLayout>
        <FormLayout onSubmit={handleSubmit}>
          <Avatar
            size="medium"
            className={styles.avatar}
          />
          <div>
            <label htmlFor="email">Adresse de messagerie :</label>
            <input
              id="email"
              data-testid="register-email-input"
            />
            <small data-testid="register-email-error">"error email"</small>
          </div>
          <div className="issou">
            <label htmlFor="password">Mot de passe :</label>
            <input
              id="password"
              type="password"
              data-testid="register-password-input"
            />
            <small data-testid="register-password-error">error password</small>
          </div>
          <div className={styles.autoConnect}>
            <Checkbox onChange={() => null} />
            <label htmlFor="autoConnect">Connexion Automatique</label>
          </div>
          <div className={styles.submitContainer}>
            <Button
              title="Connexion"
              theme="gradient"
              wait={false}
              data-testid="register-email-submit-button"
              className={styles.submitButton}
            />
            <small data-testid="register-password-submit-error">error password</small>
          </div>
        </FormLayout>
      </GradientLayout>
    </div>
  );
}

export default Login;