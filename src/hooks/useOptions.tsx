import { useEffect } from "react"
import { firebase } from "@/firebase/config";
import { UserService } from "@/Services";
import { useAppDispatch } from "@/redux/hooks";
import { onValue, ref } from "firebase/database";
import { Options } from "@/redux/slices/options/types";
import { setStoreOptions } from "@/redux/slices/options/options";

function useOptions() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const currentUserOptionsRef = ref(firebase.database, `options/${UserService.currentUser.uid}`)

    const unsubscribe = onValue(currentUserOptionsRef, async (snapshot) => {
      const userOptions = {
        ...snapshot.val()
      } as Options

      dispatch(setStoreOptions(userOptions))
    })

    return () => unsubscribe()
  }, [])
}

export default useOptions;