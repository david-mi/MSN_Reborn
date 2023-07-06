import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import { Register, AccountVerify, Home } from "@/Pages"

const browserRouter = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-account",
        element: <AccountVerify />,
      },
      {
        path: "*",
        element: <Navigate to="/register" />
      }
    ]
  }
])

export default browserRouter