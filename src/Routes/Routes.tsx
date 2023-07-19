import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import { Register, Login, AccountVerify, Home, SendEmailVerification } from "@/Pages"
import { AuthRoutes, PrivateRoutes } from "."
import VerifiedRoutes from "./VerifiedRoutes";

const browserRouter = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PrivateRoutes />,
        children: [
          {
            element: <VerifiedRoutes />,
            children: [
              {
                path: "/",
                element: <Home />
              }
            ]
          },
          {
            path: "/send-email-verification",
            element: <SendEmailVerification />,
          },
        ]
      },
      {
        element: <AuthRoutes />,
        children: [
          {
            path: "/register",
            element: <Register />,
          },
          {
            path: "/login",
            element: <Login />,
          }
        ]
      },
      {
        path: "/verify-account",
        element: <AccountVerify />,
      },
      {
        path: "*",
        element: <Navigate to="/" />
      }
    ]
  }
])

export default browserRouter