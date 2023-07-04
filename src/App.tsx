import { useEffect } from "react"
import { firebase } from "./firebase/config";
import { useAppDispatch } from "./redux/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet } from "react-router-dom";
import { setAuthenticationState } from "./redux/slices/user/user";
import { AuthenticationState } from "./redux/slices/user/types";

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    onAuthStateChanged(firebase.auth, (currentUser) => {
      let userAuthenticationState: AuthenticationState

      if (currentUser !== null) {
        userAuthenticationState = "AUTHENTICATED"
      } else {
        userAuthenticationState = "DISCONNECTED"
      }

      dispatch(setAuthenticationState(userAuthenticationState))
    })
  }, [])

  return <Outlet />
}

export default App;