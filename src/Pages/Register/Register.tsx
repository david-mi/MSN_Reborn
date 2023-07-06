import { useAppSelector } from "@/redux/hooks"
import ModaleLayout from "@/Components/Shared/ModaleLayout/ModaleLayout"
import { EmailForm, ProfileForm, PasswordForm, SendEmailVerification } from "@/Components/Register"
import AccountVerified from "@/Components/Shared/AccountVerified/AccountVerified"
import styles from "./register.module.css"

function Register() {
  const registrationStep = useAppSelector(({ register }) => register.step)

  const registerComponents = {
    EMAIL: {
      component: <EmailForm />,
      title: "Inscription - Email"
    },
    PROFILE: {
      component: <ProfileForm />,
      title: "Inscription - Profil"
    },
    PASSWORD: {
      component: <PasswordForm />,
      title: "Inscription - Mot de passe"
    },
    SEND_CONFIRMATION_EMAIL: {
      component: <SendEmailVerification />,
      title: "Inscription - Vérification de l'email"
    },
    VERIFIED: {
      component: <AccountVerified />,
      title: "Inscription - Vérifié"
    }
  };

  return (
    <div className={styles.register}>
      <ModaleLayout title={registerComponents[registrationStep].title}>
        {registerComponents[registrationStep].component}
      </ModaleLayout>
    </div>
  )
}

export default Register