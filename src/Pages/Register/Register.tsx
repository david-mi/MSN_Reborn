import { useContext } from "react"
import ModaleLayout from "@/Components/Shared/ModaleLayout/ModaleLayout"
import { EmailForm, ProfileForm } from "@/Components/Register"
import { RegisterContext } from "./Context"
import styles from "./register.module.css"

function Register() {
  const { registrationstep } = useContext(RegisterContext)

  const registerComponents = {
    EMAIL: <EmailForm />,
    PROFILE: <ProfileForm />
  }

  return (
    <div className={styles.register}>
      <ModaleLayout title="Inscription - Email">
        {registerComponents[registrationstep]}
      </ModaleLayout>
    </div>
  )
}

export default Register