import { useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { onDisconnect, ref, onValue, Unsubscribe, update } from "firebase/database"
import { firebase } from "@/firebase/config";

function VerifiedRoutes() {
  const isAccountVerified = useAppSelector(({ user }) => user.verified)
  const connectedListenerRef = useRef<Unsubscribe | null>(null)
  const firstEffectCall = useRef(true)
  const currentUser = firebase.auth.currentUser!
  const getCurrentUserProfileStatus = useAppSelector(({ user }) => user.getProfile.status)
  const userStatusBeforeDisconnect = useAppSelector(({ user }) => user.statusBeforeDisconnect)

  /**
   * Track user presence and reflect it on status
  */

  useEffect(() => {
    if (firstEffectCall.current === false || getCurrentUserProfileStatus === "PENDING") return

    (function () {
      const connectedRef = ref(firebase.database, ".info/connected");
      const userStatusEntriesRef = ref(firebase.database, `/profiles/${currentUser.uid}`);

      connectedListenerRef.current = onValue(connectedRef, () => {
        onDisconnect(userStatusEntriesRef)
          .update({ displayedStatus: "offline" })

        update(userStatusEntriesRef, { displayedStatus: userStatusBeforeDisconnect })
      });
    })()

    return () => {
      firstEffectCall.current = false

      if (connectedListenerRef.current) {
        connectedListenerRef.current!()
      }
    }
  }, [getCurrentUserProfileStatus])

  return isAccountVerified
    ? <Outlet />
    : <Navigate to="/send-email-verification" />
}

export default VerifiedRoutes;