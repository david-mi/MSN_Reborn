import React from "react"
import ReactDOM from "react-dom/client"
import browserRouter from "./Routes/Routes.tsx"
import { RouterProvider } from "react-router-dom"
import "./styles/index.css"
import { Provider } from "react-redux"
import store from "./redux/store.ts"

const rootElement = document.getElementById("root") as HTMLElement
ReactDOM.createRoot(rootElement).render(ReactRootToogleStrictMode(true))

function RootWithProvider() {
  return (
    <Provider store={store}>
      <RouterProvider router={browserRouter} />
    </Provider>
  )
}

function ReactRootToogleStrictMode(enableStrictMode: boolean) {
  return enableStrictMode
    ? (
      <React.StrictMode>
        <RootWithProvider />
      </React.StrictMode>
    )
    : <RootWithProvider />
}
