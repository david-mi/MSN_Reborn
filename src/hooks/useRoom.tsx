import { useEffect, useRef } from "react"
import { onSnapshot, collection, query, orderBy, where, startAt } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch } from "@/redux/hooks";
import { initializeRoom, setRoomMessage, setUnreadMessageCount, editRoomMessage, setRoomsLoaded } from "@/redux/slices/room/room";
import { MessageService } from "@/Services";
import { Unsubscribe } from "firebase/firestore";
import type { DatabaseRoom } from "@/redux/slices/room/types";

function useRoom() {
  const dispatch = useAppDispatch()
  const unSubscribeRoomMessagesMapRef = useRef<Map<string, Unsubscribe>>(new Map())

  useEffect(() => {
    const userSubscribedRoomsQuery = query(
      collection(firebase.firestore, "rooms"),
      where(`users.${firebase.auth.currentUser!.uid}`, "==", true),
    )

    const unSubscribeRooms = onSnapshot(userSubscribedRoomsQuery, async (roomQuerySnapshot) => {
      for (const change of roomQuerySnapshot.docChanges()) {
        const roomSnapshot = change.doc
        const roomData = { id: roomSnapshot.id, ...roomSnapshot.data() } as DatabaseRoom

        dispatch(initializeRoom(roomData))

        const oldestUnreadRoomMessageDate = await MessageService.getOldestUnreadRoomMessageDate(roomData.id)
        const dateToStartObservingMessages = await MessageService.getStartingDateToObserveMessages(roomData.id, 10, oldestUnreadRoomMessageDate)

        const observerQuery = query(
          collection(firebase.firestore, "rooms", roomData.id, "messages"),
          orderBy("createdAt"),
          startAt(dateToStartObservingMessages)
        )

        const unSubscribeRoomMessages = onSnapshot(observerQuery, (roomMessagesSnapshot) => {
          // if (roomMessagesSnapshot.metadata.hasPendingWrites) return

          roomMessagesSnapshot.docChanges().forEach(change => {
            const message = MessageService.getMessageFromSnapshot(change.doc)

            switch (change.type) {
              case "added": {
                dispatch(setRoomMessage({ message, roomId: roomSnapshot.id }))

                if (message.readBy[firebase.auth.currentUser!.uid] === false) {
                  dispatch(setUnreadMessageCount({ count: 1, roomId: roomSnapshot.id }))
                }

                break
              }
              case "modified": {
                dispatch(editRoomMessage({ message, roomId: roomSnapshot.id }))
              }
            }
          })

          unSubscribeRoomMessagesMapRef.current.set(firebase.auth.currentUser!.uid, unSubscribeRoomMessages)
        })
      }

      dispatch(setRoomsLoaded())
    })

    return () => {
      unSubscribeRooms()

      if (unSubscribeRoomMessagesMapRef.current) {
        for (const unSubscribeRoomMessages of unSubscribeRoomMessagesMapRef.current.values()) {
          unSubscribeRoomMessages()
        }
      }
    }
  }, [])
}

export default useRoom