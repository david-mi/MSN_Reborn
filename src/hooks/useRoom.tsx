import { useEffect, useRef } from "react"
import { onSnapshot, query, where, documentId, collection, orderBy } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRoomsIds, setRooms, setRoomMessages } from "@/redux/slices/room/room";
import { MessageService, RoomService, UserService } from "@/Services";
import { doc, Unsubscribe } from "firebase/firestore";

function useRoom() {
  const dispatch = useAppDispatch()
  const roomsIds = useAppSelector(({ room }) => room.roomsIds)
  const roomMessagesUnsubscribeListRef = useRef<Unsubscribe[]>([])

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

    const unsubscribe = onSnapshot(queryUserContacts, (snapshot) => {
      dispatch(setRooms(RoomService.getRooms(snapshot)))

      snapshot.docs.forEach((roomSnapshot) => {
        const roomsMessagesQuery = query(
          collection(firebase.firestore, "rooms", roomSnapshot.id, "messages"),
          orderBy("createdAt", "asc")
        )

        const roomMessagesUnsubscribe = onSnapshot(roomsMessagesQuery, (messagesSnapshot) => {
          const messages = MessageService.getMessagesFromSnapshot(messagesSnapshot)
          dispatch(setRoomMessages({ messages, roomId: roomSnapshot.id }))
        })

        roomMessagesUnsubscribeListRef.current.push(roomMessagesUnsubscribe)
      })
    })

    return () => {
      unsubscribe()
      roomMessagesUnsubscribeListRef.current.forEach((roomMessagesUnsubscribe) => roomMessagesUnsubscribe())
      roomMessagesUnsubscribeListRef.current = []
    }
  }, [roomsIds])

}

export default useRoom