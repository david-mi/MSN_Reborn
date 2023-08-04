import { useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { onDisconnect, ref, onValue, push, Unsubscribe } from "firebase/database"
import { firebase } from "@/firebase/config";
import { getSavedStatus } from "@/redux/slices/user/user";

function VerifiedRoutes() {
  const dispatch = useAppDispatch()
  const isAccountVerified = useAppSelector(({ user }) => user.verified)
  const userId = useAppSelector(({ user }) => user.id)
  const connectedListenerRef = useRef<Unsubscribe | null>(null)

  /**
   * Track user presence and reflect it on status
   */

  useEffect(() => {
    if (connectedListenerRef.current) return

    const connectedRef = ref(firebase.database, ".info/connected");
    const userStatusEntriesRef = ref(firebase.database, `/status/${userId}/entries`);
    const userStatusNewEntryRef = push(userStatusEntriesRef, Date.now())

    connectedListenerRef.current = onValue(connectedRef, () => {
      onDisconnect(userStatusNewEntryRef)
        .remove()
        .then(() => dispatch(getSavedStatus()))
    });

    return () => connectedListenerRef.current!();
  }, [])


  return isAccountVerified
    ? <Outlet />
    : <Navigate to="/send-email-verification" />
}

export default VerifiedRoutes;