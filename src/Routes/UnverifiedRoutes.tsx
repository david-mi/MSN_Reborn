import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

function UnverifiedRoutes() {
  const isAccountNonVerified = useAppSelector(({ user }) => user.verified === false)

  return isAccountNonVerified
    ? <Outlet />
    : <Navigate to="/" />
}

export default UnverifiedRoutes;