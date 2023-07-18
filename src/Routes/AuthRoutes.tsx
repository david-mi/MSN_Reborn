import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

function AuthRoutes() {
  const authState = useAppSelector(({ user }) => user.authState)
  const registrationStep = useAppSelector(({ register }) => register.step)
  const isNotIsRegistrationProcess = registrationStep === "EMAIL"

  if (authState === "AUTHENTICATED" && isNotIsRegistrationProcess) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default AuthRoutes;