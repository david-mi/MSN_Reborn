import { useCallback, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { setRoomMessage, editRoomMessage } from "@/redux/slices/room/room"
import { MessageService } from "@/Services"
import { orderBy, collection, query, onSnapshot, startAfter, limit } from "firebase/firestore"
import { firebase } from "@/firebase/config"

function useRoomMessagesPagination(roomId: string, paginationTicks = 10) {
  const dispatch = useAppDispatch()
  const [canPaginate, setCanPaginate] = useState(true)
  const [loadingPagination, setLoadingPagination] = useState(false)
  const currentRoomOldestRetrievedMessageDate = useAppSelector(({ room }) => room.roomsList[roomId].oldestRetrievedMessageDate)


  const paginate = useCallback(async () => {
    if (currentRoomOldestRetrievedMessageDate === null) return
    setLoadingPagination(true)

    const roomMessagesPaginationQuery = query(
      collection(firebase.firestore, "rooms", roomId, "messages"),
      orderBy("createdAt", "desc"),
      startAfter(new Date(currentRoomOldestRetrievedMessageDate)),
      limit(paginationTicks)
    )

    onSnapshot(roomMessagesPaginationQuery, (roomMessagesSnapshot) => {
      const docChanges = roomMessagesSnapshot.docChanges()
      if (roomMessagesSnapshot.empty) {
        setCanPaginate(false)
        setLoadingPagination(false)
        return
      }

      docChanges.forEach((change) => {
        const message = MessageService.getMessageFromSnapshot(change.doc)

        switch (change.type) {
          case "added": {
            dispatch(setRoomMessage({ message, roomId, insertBefore: true }))
            break
          }
          case "modified": {
            dispatch(editRoomMessage({ message, roomId }))
          }
        }
      })

      setLoadingPagination(false)
    })

  }, [currentRoomOldestRetrievedMessageDate])

  return {
    paginate,
    canPaginate,
    loadingPagination
  }

}

export default useRoomMessagesPagination