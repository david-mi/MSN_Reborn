import { useAppSelector } from "@/redux/hooks"
import ModaleLayout from "@/Components/Shared/ModaleLayout/ModaleLayout"
import { EmailForm, ProfileForm } from "@/Components/Register"
import styles from "./register.module.css"

function Register() {
  const registrationStep = useAppSelector(({ register }) => register.step)

  const registerComponents = {
    EMAIL: <EmailForm />,
    PROFILE: <ProfileForm data-testid="register-profile-form" />,
    PASSWORD: <p>PASSWORD</p>,
    SEND_CONFIRMATION_EMAIL: <p>SEND_CONFIRMATION_EMAIL</p>,
    VERIFIED: <p>VERIFIED</p>
  }

  return (
    <div className={styles.register}>
      <ModaleLayout title="Inscription - Email">
        {registerComponents[registrationStep]}
      </ModaleLayout>
    </div>
  )
}

export default Register