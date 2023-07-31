import { useEffect } from "react"
import { onSnapshot } from "firebase/firestore";
import { doc } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import { UserService } from "@/Services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUsersWhoSentFriendRequest } from "@/redux/slices/contact/contact";

function useFriendRequest() {
  const dispatch = useAppDispatch()
  const usersWhoSentFriendRequest = useAppSelector(({ contact }) => contact.usersWhoSentFriendRequest)
  const haveFriendRequest = usersWhoSentFriendRequest.length !== 0

  useEffect(() => {
    const receivedFriendRequestsRef = doc(firebase.firestore, "receivedFriendRequests", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(receivedFriendRequestsRef, async (snapshot) => {
      dispatch(getUsersWhoSentFriendRequest(snapshot.data()))
    })

    return () => unsubscribe()
  }, [])

  return {
    usersWhoSentFriendRequest,
    haveFriendRequest,
  }
}

export default useFriendRequest