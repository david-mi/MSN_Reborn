import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "@/Pages/Register/Register";

const browserRouter = createBrowserRouter([
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "*",
    element: <Navigate to="/register" />
  }
])

export default browserRouter