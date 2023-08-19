import { useEffect, useRef } from "react"
import { onSnapshot, collection, query, orderBy, where } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch } from "@/redux/hooks";
import { initializeRoom, setRoomMessage } from "@/redux/slices/room/room";
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

            const unReadMessagesQuery = query(
              collection(firebase.firestore, "rooms", roomSnapshot.id, "messages"),
              where(`readBy.${firebase.auth.currentUser!.uid}`, "==", false),
              orderBy("createdAt", "asc")
            )

            const unSubscribeRoomMessages = onSnapshot(unReadMessagesQuery, (roomMessagesSnapshot) => {
              if (roomMessagesSnapshot.metadata.hasPendingWrites) return

              roomMessagesSnapshot.docChanges().forEach(change => {
                if (change.type !== "added") return

                const message = MessageService.getMessageFromSnapshot(change.doc)
                dispatch(setRoomMessage({ message, roomId: roomSnapshot.id }))
                dispatch(setUnreadMessageCount({ count: 1, roomId: roomSnapshot.id }))
                roomsMessagesUnsubscribeCallback.current.set(retrievedRoomId, unSubscribeRoomMessages)
              })
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