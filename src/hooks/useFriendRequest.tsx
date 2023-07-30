import { useEffect } from "react"
import { onSnapshot } from "firebase/firestore";
import { doc } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import { UserService } from "@/Services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFriendRequestingUsers } from "@/redux/slices/contact/contact";

function useFriendRequest() {
  const dispatch = useAppDispatch()
  const friendRequestingUsers = useAppSelector(({ contact }) => contact.friendRequestingUsers)
  const hasFriendRequests = friendRequestingUsers.length !== 0

  useEffect(() => {
    const receivedFriendRequestsRef = doc(firebase.firestore, "receivedFriendRequests", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(receivedFriendRequestsRef, async (snapshot) => {
      dispatch(getFriendRequestingUsers(snapshot.data()))
    })

    return () => unsubscribe()
  }, [])

  return {
    friendRequestingUsers,
    hasFriendRequests,
  }
}

export default useFriendRequest