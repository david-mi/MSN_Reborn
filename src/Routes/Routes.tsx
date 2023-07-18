import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import { Register, Login, AccountVerify, Home } from "@/Pages"
import { AuthRoutes, PrivateRoutes } from "."

const browserRouter = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "/",
            element: <Home />
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
          },
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