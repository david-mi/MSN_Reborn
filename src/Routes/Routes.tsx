import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "@/Pages/Register/Register";
import App from "@/App";
import EmailVerify from "@/Pages/AccountVerify/AccountVerify";

const browserRouter = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-account",
        element: <EmailVerify />,
      },
      {
        path: "*",
        element: <Navigate to="/register" />
      }
    ]
  }
])

export default browserRouter