import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

function VerifiedRoutes() {
  const isAccountVerified = useAppSelector(({ user }) => user.verified)

  return isAccountVerified
    ? <Outlet />
    : <Navigate to="/send-email-verification" />
}

export default VerifiedRoutes;