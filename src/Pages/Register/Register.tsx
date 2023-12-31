import { Link } from "react-router-dom"
import { useAppSelector } from "@/redux/hooks"
import { ModaleLayout, FooterLinks } from "@/Components/Shared";
import { EmailForm, ProfileForm, PasswordForm } from "@/Components/Register"
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
    }
  };

  return (
    <div className={styles.register} data-testid="register">
      <ModaleLayout title={registerComponents[registrationStep].title}>
        {registerComponents[registrationStep].component}
        <FooterLinks>
          <Link to="/login">Déjà inscrit ? Connectez-vous</Link>
        </FooterLinks>
      </ModaleLayout>
    </div>
  )
}

export default Register