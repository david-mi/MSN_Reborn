import { useEffect } from "react"
import { onSnapshot, query, where, documentId, collection } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRoomsIds, getRooms } from "@/redux/slices/room/room";
import { UserService } from "@/Services";
import { doc } from "firebase/firestore";

function useRoom() {
  const dispatch = useAppDispatch()
  const roomsIds = useAppSelector(({ room }) => room.roomsIds)

  useEffect(() => {
    const roomsIdsRef = doc(firebase.firestore, "roomsIds", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(roomsIdsRef, async (snapshot) => {
      const retrievedRoomsIds = snapshot.data() as { list: string[] }
      dispatch(setRoomsIds(retrievedRoomsIds))
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (roomsIds.length === 0) return

    const queryUserContacts = query(
      collection(firebase.firestore, "rooms"),
      where(documentId(), "in", roomsIds)
    )

    const unsubscribe = onSnapshot(queryUserContacts, async (snapshot) => {
      dispatch(getRooms(snapshot.docs))
    })

    return () => unsubscribe()
  }, [roomsIds])
}

export default useRoom