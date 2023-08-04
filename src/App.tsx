import { useEffect } from "react"
import { firebase } from "./firebase/config";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet } from "react-router-dom";
import { setAuthenticationState, getProfile, disconnect } from "./redux/slices/user/user";
import { AuthenticationState } from "./redux/slices/user/types";
import Loader from "./Components/Shared/Loader/Loader";
import store from "./redux/store";

function App() {
  const dispatch = useAppDispatch()
  const authState = useAppSelector(({ user }) => user.authState)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, async (currentUser) => {
      let userAuthenticationState: AuthenticationState
      if (
        store.getState().register.request.status === "PENDING" ||
        store.getState().login.request.status === "PENDING"
      ) return

      if (currentUser) {
        try {
          await dispatch(getProfile()).unwrap()
          userAuthenticationState = "AUTHENTICATED"
        } catch (error) {
          return await dispatch(disconnect())
        }
      } else {
        userAuthenticationState = "DISCONNECTED"
      }

      dispatch(setAuthenticationState(userAuthenticationState))

      return () => unsubscribe()
    })
  }, [])

  return authState === "PENDING"
    ? <Loader size={"8rem"} />
    : <Outlet />
}

export default App;