import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { onDisconnect, ref, onValue, update } from "firebase/database"
import { firebase } from "@/firebase/config";

function VerifiedRoutes() {
  const isAccountVerified = useAppSelector(({ user }) => user.verified)
  const getCurrentUserProfileStatus = useAppSelector(({ user }) => user.getProfile.status)
  const currentUserId = useAppSelector(({ user }) => user.id)
  const userStatusBeforeDisconnect = useAppSelector(({ user }) => user.statusBeforeDisconnect)

  /**
   * Track user presence and reflect it on status
  */

  useEffect(() => {
    if (getCurrentUserProfileStatus === "PENDING") return

    const connectedRef = ref(firebase.database, ".info/connected");
    const userStatusEntriesRef = ref(firebase.database, `/profiles/${currentUserId}`);

    return onValue(connectedRef, (snapshot) => {
      if (snapshot.val() == false) return

      onDisconnect(userStatusEntriesRef)
        .update({ displayedStatus: "offline" })

      update(userStatusEntriesRef, { displayedStatus: userStatusBeforeDisconnect })
    });
  }, [getCurrentUserProfileStatus])

  return isAccountVerified
    ? <Outlet />
    : <Navigate to="/send-email-verification" />
}

export default VerifiedRoutes;