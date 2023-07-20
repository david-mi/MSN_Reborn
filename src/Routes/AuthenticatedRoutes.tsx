import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

function AuthenticatedRoutes() {
  const authState = useAppSelector(({ user }) => user.authState)

  return authState === "AUTHENTICATED"
    ? <Outlet />
    : <Navigate to="/login" />
}

export default AuthenticatedRoutes;