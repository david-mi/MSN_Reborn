import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { doc, updateDoc } from "firebase/firestore"
import { onDisconnect, ref, set, onValue } from "firebase/database"
import { firebase } from "@/firebase/config";
import { setStatus } from "@/redux/slices/user/user";
import { DisplayedStatus } from "@/redux/slices/user/types";

function VerifiedRoutes() {
  const dispatch = useAppDispatch()
  const isAccountVerified = useAppSelector(({ user }) => user.verified)

  useEffect(() => {
    const currentUserId = firebase.auth.currentUser!.uid
    const userStatusDatabaseRef = ref(firebase.database, `/status/${currentUserId}`);
    console.log(isAccountVerified)

    const isOnlineForFirestore = {
      displayedStatus: "online",
    };

    const isOfflineForFirestore = {
      displayedStatus: "offline",
    };

    const currentUserRef = doc(firebase.firestore, "users", currentUserId)
    const connectedRef = ref(firebase.database, ".info/connected");

    const connectedListener = onValue(connectedRef, async (snapshot) => {
      const isConnected = snapshot.val();

      if (isConnected === false) {
        return updateDoc(currentUserRef, isOfflineForFirestore)
      }

      onDisconnect(userStatusDatabaseRef)
        .set(isOfflineForFirestore)
        .then(() => {
          set(userStatusDatabaseRef, isOnlineForFirestore);
          updateDoc(currentUserRef, isOnlineForFirestore)
          dispatch(setStatus(isOnlineForFirestore.displayedStatus as DisplayedStatus))
        });
    });

    return () => connectedListener();
  }, [])


  return isAccountVerified
    ? <Outlet />
    : <Navigate to="/send-email-verification" />
}

export default VerifiedRoutes;