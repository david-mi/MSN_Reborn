import React from "react"
import ReactDOM from "react-dom/client"
import browserRouter from "./routes/Routes.tsx"
import { RouterProvider } from "react-router-dom"
import "./styles/index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={browserRouter} />
  </React.StrictMode>,
)
