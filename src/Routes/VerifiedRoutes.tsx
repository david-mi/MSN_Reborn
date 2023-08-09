import { useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { onDisconnect, ref, onValue, push, Unsubscribe } from "firebase/database"
import { firebase } from "@/firebase/config";
import { AuthService } from "@/Services";

function VerifiedRoutes() {
  const isAccountVerified = useAppSelector(({ user }) => user.verified)
  const connectedListenerRef = useRef<Unsubscribe | null>(null)
  const firstEffectCall = useRef(true)
  const currentUser = firebase.auth.currentUser!

  /**
   * Track user presence and reflect it on status
  */

  useEffect(() => {
    if (firstEffectCall.current === false) return

    (async function () {
      const userAuthTimeToNumber = await AuthService.getUserAuthTimeToNumber()
      const connectedRef = ref(firebase.database, ".info/connected");
      const userStatusEntriesRef = ref(firebase.database, `/status/${currentUser.uid}/entries/${userAuthTimeToNumber}`);
      const userStatusNewEntryRef = push(userStatusEntriesRef, true)

      connectedListenerRef.current = onValue(connectedRef, async () => {
        onDisconnect(userStatusNewEntryRef)
          .remove()
      });
    })()

    return () => {
      firstEffectCall.current = false

      if (connectedListenerRef.current) {
        connectedListenerRef.current!()
      }
    }
  }, [])

  return isAccountVerified
    ? <Outlet />
    : <Navigate to="/send-email-verification" />
}

export default VerifiedRoutes;