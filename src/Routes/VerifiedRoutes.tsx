import { useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { onDisconnect, ref, onValue, push, Unsubscribe, onChildRemoved } from "firebase/database"
import { firebase } from "@/firebase/config";
import { disconnect, getSavedStatus } from "@/redux/slices/user/user";
import { signOut } from "firebase/auth";

function VerifiedRoutes() {
  const dispatch = useAppDispatch()
  const isAccountVerified = useAppSelector(({ user }) => user.verified)
  const userId = useAppSelector(({ user }) => user.id)
  const connectedListenerRef = useRef<Unsubscribe | null>(null)
  const saveddListenerRef = useRef<Unsubscribe | null>(null)

  /**
   * Track user presence and reflect it on status
   */

  useEffect(() => {
    if (connectedListenerRef.current) return


    const connectedRef = ref(firebase.database, ".info/connected");
    const userStatusEntriesRef = ref(firebase.database, `/status/${userId}/entries`);
    const userStatusNewEntryRef = push(userStatusEntriesRef, Date.now())
    const userStatusSavedRef = ref(firebase.database, `/status/${userId}/saved`);

    connectedListenerRef.current = onValue(connectedRef, () => {
      onDisconnect(userStatusNewEntryRef)
        .remove()
        .then(() => {
          dispatch(getSavedStatus())
          saveddListenerRef.current = onValue(userStatusSavedRef, (snapshot) => {
            const shouldDisconnectUser = snapshot.exists() === false

            if (shouldDisconnectUser) {
              signOut(firebase.auth)
            }
          })
        })
    });

    return () => {
      connectedListenerRef.current!()

      if (saveddListenerRef.current) {
        saveddListenerRef.current!()
      }
    }
  }, [])

  return isAccountVerified
    ? <Outlet />
    : <Navigate to="/send-email-verification" />
}

export default VerifiedRoutes;