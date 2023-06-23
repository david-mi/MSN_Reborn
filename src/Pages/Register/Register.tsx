import { useState } from "react"
import ModaleLayout from "@/Components/ModaleLayout/ModaleLayout"
import styles from "./register.module.css"
import { EmailForm } from "./Components"
import type { RegistrationStep, RegistrationData } from "./types"
import { RegisterContext } from "./Context"

const registerForms = {
  EMAIL: <EmailForm />,
}

function Register() {
  const [registrationstep, setRegistrationStep] = useState<RegistrationStep>("EMAIL")
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: "",
    password: "",
    nickname: "",
    avatar: ""
  })

  return (
    <RegisterContext.Provider value={{ setRegistrationStep, registrationData, setRegistrationData }}>
      <div className={styles.register}>
        <ModaleLayout title="Inscription - Email">
          {registerForms[registrationstep]}
        </ModaleLayout>
      </div>
    </RegisterContext.Provider>
  )
}

export default Register