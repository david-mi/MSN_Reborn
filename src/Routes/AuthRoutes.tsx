import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

function AuthRoutes() {
  const authState = useAppSelector(({ user }) => user.authState)
  const isAccountVerified = useAppSelector(({ user }) => user.verified)

  if (authState === "AUTHENTICATED") {
    return isAccountVerified
      ? <Navigate to="/" />
      : <Navigate to="/send-email-verification" />
  }

  return <Outlet />
}

export default AuthRoutes;