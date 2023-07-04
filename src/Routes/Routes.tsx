import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "@/Pages/Register/Register";
import App from "@/App";

const browserRouter = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "*",
        element: <Navigate to="/register" />
      }
    ]
  }
])

export default browserRouter