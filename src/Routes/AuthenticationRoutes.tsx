import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

function AuthenticationRoutes() {
  const authState = useAppSelector(({ user }) => user.authState)

  return authState === "AUTHENTICATED"
    ? <Navigate to="/" />
    : <Outlet />
}

export default AuthenticationRoutes;