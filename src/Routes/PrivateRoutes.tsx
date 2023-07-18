import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import Loader from "@/Components/Shared/Loader/Loader";

function Private() {
  const authState = useAppSelector(({ user }) => user.authState)

  switch (authState) {
    case "PENDING": return <Loader size={"8rem"} />
    case "DISCONNECTED": return <Navigate to="/login" />
    case "AUTHENTICATED": return <Outlet />
  }
}

export default Private;