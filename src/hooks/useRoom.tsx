import { useEffect, useRef } from "react"
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch } from "@/redux/hooks";
import { initializeRoom, setRoomMessages } from "@/redux/slices/room/room";
import { MessageService, UserService } from "@/Services";
import { doc, Unsubscribe } from "firebase/firestore";
import type { DatabaseRoom, RoomId } from "@/redux/slices/room/types";

function useRoom() {
  const dispatch = useAppDispatch()
  const roomsUnsubscribeCallback = useRef<Map<RoomId, Unsubscribe>>(new Map())
  const roomsMessagesUnsubscribeCallback = useRef<Map<RoomId, Unsubscribe>>(new Map())

  useEffect(() => {
    const roomsIdsRef = doc(firebase.firestore, "roomsIds", UserService.currentUser.uid)

    const unSubscribeRoomsIds = onSnapshot(roomsIdsRef, async (roomsIdsSnapshot) => {
      const retrievedRoomsIds: RoomId[] = roomsIdsSnapshot.data()?.list ?? []

      retrievedRoomsIds.forEach((retrievedRoomId) => {
        const hasAddedRoomId = roomsUnsubscribeCallback.current.has(retrievedRoomId) === false

        if (hasAddedRoomId) {
          const roomToObserveRef = doc(firebase.firestore, "rooms", retrievedRoomId)

          const unSubscribeRoom = onSnapshot(roomToObserveRef, (roomSnapshot) => {
            const roomData = { id: roomSnapshot.id, ...roomSnapshot.data() } as DatabaseRoom

            dispatch(initializeRoom(roomData))
            roomsUnsubscribeCallback.current.set(retrievedRoomId, unSubscribeRoom)

            const roomToObserveMessagesQuery = query(
              collection(firebase.firestore, "rooms", roomSnapshot.id, "messages"),
              orderBy("createdAt", "asc")
            )

            const unSubscribeRoomMessages = onSnapshot(roomToObserveMessagesQuery, (roomMessagesSnapshot) => {
              const messages = MessageService.getMessagesFromSnapshot(roomMessagesSnapshot)
              if (roomMessagesSnapshot.metadata.hasPendingWrites === false) {
                dispatch(setRoomMessages({ messages, roomId: roomSnapshot.id }))
                roomsMessagesUnsubscribeCallback.current.set(retrievedRoomId, unSubscribeRoomMessages)
              }
            })
          })
        }
      })

      for (const [savedRoomId, unSubscribeRoom] of roomsUnsubscribeCallback.current) {
        const hasDeletedRoomId = retrievedRoomsIds.includes(savedRoomId) === false

        if (hasDeletedRoomId) {
          unSubscribeRoom()
          const unSubscribeRoomMessages = roomsMessagesUnsubscribeCallback.current.get(savedRoomId)

          if (unSubscribeRoomMessages) {
            unSubscribeRoomMessages()
          }

          roomsUnsubscribeCallback.current.delete(savedRoomId)
        }
      }
    })

    return () => {
      unSubscribeRoomsIds()

      for (const unSubscribeRoom of roomsUnsubscribeCallback.current.values()) {
        unSubscribeRoom()
      }

      for (const unSubscribeRoomMessages of roomsMessagesUnsubscribeCallback.current.values()) {
        unSubscribeRoomMessages()
      }
    }
  }, [])
}

export default useRoom