import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RegisterProvider from "@/Pages/Register/Context";

const browserRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/register" element={<RegisterProvider />} />
      <Route path="*" element={<Navigate to="/register" />} />
    </>
  )
)

export default browserRouter