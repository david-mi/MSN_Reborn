import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import { Register, Login, AccountVerify, Home, SendEmailVerification } from "@/Pages"
import { AuthenticationRoutes, AuthenticatedRoutes, UnverifiedRoutes, VerifiedRoutes } from "."

export const routesConfig = [
  {
    element: <App />,
    children: [
      {
        element: <AuthenticatedRoutes />,
        children: [
          {
            element: <UnverifiedRoutes />,
            children: [
              {
                path: "/send-email-verification",
                element: <SendEmailVerification />,
              },
            ]
          },
          {
            element: <VerifiedRoutes />,
            children: [
              {
                path: "/",
                element: <Home />
              }
            ]
          },
        ]
      },
      {
        element: <AuthenticationRoutes />,
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
]

const browserRouter = createBrowserRouter(routesConfig)

export default browserRouter