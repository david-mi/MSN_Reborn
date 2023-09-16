import { useEffect, useRef, useMemo } from "react"
import { onSnapshot, collection, query, orderBy, startAt } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initializeRoom, setRoomMessage, setUnreadMessageCount, editRoomMessage, setRoomsLoaded, modifyRoom, setOldestRoomMessageDate, removeRoom } from "@/redux/slices/room/room";
import { MessageService } from "@/Services";
import { Unsubscribe } from "firebase/firestore";
import { UserId, type DatabaseRoom } from "@/redux/slices/room/types";

function useRoom() {
  const dispatch = useAppDispatch()
  const roomsList = useAppSelector(({ room }) => room.roomsList)
  const customRoomsList = useMemo(() => {
    return Object
      .values(roomsList)
      .filter((room) => room.type === "manyToMany")
  }, [roomsList])
  const unSubscribeMessagesCallbacksRef = useRef<Map<UserId, Unsubscribe>>(new Map())
  const hasAddedOldestRoomMessageDate = useRef(false)

  useEffect(() => {
    const userSubscribedRoomsQuery = query(
      collection(firebase.firestore, "rooms"),
      orderBy(`users.subscribed.${firebase.auth.currentUser!.uid}`)
    )

    const unSubscribeRooms = onSnapshot(userSubscribedRoomsQuery, async (roomQuerySnapshot) => {
      for (const change of roomQuerySnapshot.docChanges()) {
        const roomSnapshot = change.doc
        const roomData = { id: roomSnapshot.id, ...roomSnapshot.data() } as DatabaseRoom

        switch (change.type) {
          case "added": {
            const oldestUnreadRoomMessageDate = await MessageService.getOldestUnreadRoomMessageDate(roomData.id)
            const dateToStartObservingMessages = await MessageService.getStartingDateToObserveMessages(roomData.id, 10, oldestUnreadRoomMessageDate)

            const observerQuery = query(
              collection(firebase.firestore, "rooms", roomData.id, "messages"),
              orderBy("createdAt"),
              startAt(dateToStartObservingMessages)
            )

            dispatch(initializeRoom(roomData))

            const unSubscribeRoomMessages = onSnapshot(observerQuery, (roomMessagesSnapshot) => {
              if (roomMessagesSnapshot.metadata.hasPendingWrites) return

              roomMessagesSnapshot.docChanges().forEach(change => {
                const message = MessageService.getMessageFromSnapshot(change.doc)
                switch (change.type) {
                  case "added": {
                    if (hasAddedOldestRoomMessageDate.current === false) {
                      dispatch(setOldestRoomMessageDate({ roomId: roomSnapshot.id, date: message.createdAt }))
                      hasAddedOldestRoomMessageDate.current = true
                    }

                    dispatch(setRoomMessage({ message, roomId: roomSnapshot.id }))

                    if (message.readBy[firebase.auth.currentUser!.uid] === false && message.userId !== "system") {
                      dispatch(setUnreadMessageCount({ count: 1, roomId: roomSnapshot.id }))
                    }

                    break
                  }
                  case "modified": {
                    dispatch(editRoomMessage({ message, roomId: roomSnapshot.id }))
                  }
                }
              })
            })

            unSubscribeMessagesCallbacksRef.current.set(roomData.id, unSubscribeRoomMessages)
            break;
          }
          case "modified": {
            dispatch(modifyRoom(roomData))
            break;
          }
          case "removed": {
            dispatch(removeRoom(roomData.id))
            const unsubscribeRoomMessages = unSubscribeMessagesCallbacksRef.current.get(roomData.id)

            if (unsubscribeRoomMessages) {
              unsubscribeRoomMessages()
              unSubscribeMessagesCallbacksRef.current.delete(roomData.id)
            }
          }
        }
      }

      dispatch(setRoomsLoaded())
    })

    return () => {
      unSubscribeRooms()

      Array
        .from(unSubscribeMessagesCallbacksRef.current.values())
        .forEach((unsubscribeMessages) => unsubscribeMessages())
    }
  }, [])

  return {
    customRoomsList,
    customRoomsListCount: customRoomsList.length
  }
}

export default useRoom