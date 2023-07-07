import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import { Register, AccountVerify, Home } from "@/Pages"
import Private from "./Private";

const browserRouter = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <Private />,
        children: [
          {
            path: "/",
            element: <Home />
          },
        ]
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
        element: <Navigate to="/" />
      }
    ]
  }
])

export default browserRouter