import ModaleLayout from "@/Components/ModaleLayout/ModaleLayout"
import styles from "./register.module.css"
import EmailForm from "./Components/EmailForm/EmailForm"

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