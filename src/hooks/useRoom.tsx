import { useEffect } from "react"
import { onSnapshot } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRoomsIds } from "@/redux/slices/room/room";
import { UserService } from "@/Services";
import { doc } from "firebase/firestore";

function useRoom() {
  const dispatch = useAppDispatch()
  const roomsIds = useAppSelector(({ room }) => room.roomsIds)
  // const contacts = useAppSelector(({ contact }) => contact.contactsList)
  // const getRoomsRequest = useAppSelector(({ room }) => room.getRoomsRequest)

  useEffect(() => {
    const roomsIdsRef = doc(firebase.firestore, "roomsIds", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(roomsIdsRef, async (snapshot) => {
      const retrievedRoomsIds = snapshot.data() as { list: string[] }
      dispatch(setRoomsIds(retrievedRoomsIds))
      // dispatch(initializeContactsList(snapshot.data()))
    })

    return () => unsubscribe()
  }, [])
}

export default useRoom