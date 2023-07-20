import { useEffect } from "react"
import { firebase } from "./firebase/config";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet } from "react-router-dom";
import { setAuthenticationState, retrieveProfile } from "./redux/slices/user/user";
import { AuthenticationState } from "./redux/slices/user/types";
import Loader from "./Components/Shared/Loader/Loader";

function App() {
  const dispatch = useAppDispatch()
  const authState = useAppSelector(({ user }) => user.authState)

  useEffect(() => {
    onAuthStateChanged(firebase.auth, async (currentUser) => {
      let userAuthenticationState: AuthenticationState

      if (currentUser) {
        await dispatch(retrieveProfile())
        userAuthenticationState = "AUTHENTICATED"
      } else {
        userAuthenticationState = "DISCONNECTED"
      }

      dispatch(setAuthenticationState(userAuthenticationState))
    })
  }, [])

  return authState === "PENDING"
    ? <Loader size={"8rem"} />
    : <Outlet />
}

export default App;