import ModaleLayout from "../../components/ModaleLayout/ModaleLayout"
import styles from "./register.module.css"
import EmailForm from "./components/EmailForm/EmailForm"

function Register() {
  return (
    <div className={styles.register}>
      <ModaleLayout title="Inscription - Email">
        <EmailForm />
      </ModaleLayout>
    </div>
  )
}
export default Register