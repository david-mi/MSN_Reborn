import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { UserProfile } from "@/redux/slices/user/types";
import { UserService } from "@/Services";
import { useAppDispatch } from "@/redux/hooks";
import { setProfile } from "@/redux/slices/user/user";

function useProfile() {
  const dispatch = useAppDispatch()
  const [isLoadingForTheFirstTime, setisLoadingForTheFirstTime] = useState(true)

  useEffect(() => {
    const userRef = doc(firebase.firestore, "users", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(userRef, async (snapshot) => {
      const userProfile = {
        ...snapshot.data(),
        id: snapshot.id
      } as UserProfile

      dispatch(setProfile(userProfile))
      setisLoadingForTheFirstTime(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    isLoadingForTheFirstTime
  }
}

export default useProfile;