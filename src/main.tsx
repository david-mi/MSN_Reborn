import React from "react"
import ReactDOM from "react-dom/client"
import browserRouter from "./Routes/Routes.tsx"
import { RouterProvider } from "react-router-dom"
import "./styles/index.css"
import { Provider } from "react-redux"
import store from "./redux/store.ts"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={browserRouter} />
    </Provider>
  </React.StrictMode>,
)
