import { useEffect } from "react"
import { onSnapshot, query, where, documentId, collection } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ContactService } from "@/Services";
import { setRoomUsersProfile } from "@/redux/slices/room/room";
import { UserProfile } from "@/redux/slices/user/types";

function useRoomUsers(roomId: string) {
  const dispatch = useAppDispatch()
  const currentRoomUsersId = useAppSelector(({ room }) => {
    const currentRoom = room.roomsList.find((roomToFind) => roomToFind.id === roomId)!
    return currentRoom.users
  })

  useEffect(() => {
    const nonContactRoomUsersQuery = query(
      collection(firebase.firestore, "users"),
      where(documentId(), "in", currentRoomUsersId)
    )

    const unsubscribe = onSnapshot(nonContactRoomUsersQuery, async (snapshot) => {
      const roomUsersProfile = await ContactService.getContactsProfile(snapshot.docs)
      const usersProfileIndexes: {
        [id: string]: UserProfile
      } = {}

      for (const userProfile of roomUsersProfile) {
        usersProfileIndexes[userProfile.id] = userProfile
      }

      dispatch(setRoomUsersProfile({ roomId, usersProfile: usersProfileIndexes }))
    })

    return () => unsubscribe()
  }, [currentRoomUsersId])
}

export default useRoomUsers