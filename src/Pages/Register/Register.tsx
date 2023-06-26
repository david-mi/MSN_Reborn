import { useContext } from "react"
import ModaleLayout from "@/Components/ModaleLayout/ModaleLayout"
import { EmailForm, ProfileForm } from "./Components"
import { RegisterContext } from "./Context"
import styles from "./register.module.css"

const registerForms = {
  EMAIL: <EmailForm />,
  PROFILE: <ProfileForm />
}

function Register() {
  const { registrationstep } = useContext(RegisterContext)

  return (
    <div className={styles.register}>
      <ModaleLayout title="Inscription - Email">
        {registerForms[registrationstep]}
      </ModaleLayout>
    </div>
  )
}

export default Register