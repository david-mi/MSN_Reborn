import { useState, useEffect } from "react"
import { firebase } from "@/firebase/config";
import { UserProfile } from "@/redux/slices/user/types";
import { UserService } from "@/Services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setProfile } from "@/redux/slices/user/user";
import { onValue, ref } from "firebase/database";

function useProfile() {
  const dispatch = useAppDispatch()
  const [isLoadingForTheFirstTime, setisLoadingForTheFirstTime] = useState(true)
  const retrieveRoomsStatus = useAppSelector(({ room }) => room.getRoomsRequest.status)

  useEffect(() => {
    if (retrieveRoomsStatus === "PENDING") return
    const currentUserProfileRef = ref(firebase.database, `profiles/${UserService.currentUser.uid}`)

    const unsubscribe = onValue(currentUserProfileRef, async (snapshot) => {
      const userProfile = {
        ...snapshot.val(),
        id: snapshot.key
      } as UserProfile

      dispatch(setProfile(userProfile))
      setisLoadingForTheFirstTime(false)
    })

    return () => unsubscribe()
  }, [retrieveRoomsStatus])

  return {
    isLoadingForTheFirstTime
  }
}

export default useProfile;