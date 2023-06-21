import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Register from "../pages/Register/Register";

const browserRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/register" />} />
    </>
  )
)

export default browserRouter