import { useEffect } from "react"
import { onSnapshot, query, where, documentId, collection } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ContactService } from "@/Services";
import { setRoomNonContactUsersProfile } from "@/redux/slices/room/room";
import { UserProfile } from "@/redux/slices/user/types";
import { RoomType } from "@/redux/slices/room/types";

function useRoomNonFriendUsers(roomId: string, roomType: RoomType) {
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector(({ user }) => user.id)
  const currentRoomUsersId = useAppSelector(({ room }) => {
    const currentRoomId = room.currentRoomId
    return room.roomsList[currentRoomId as string].users
  })
  const contactsIds = useAppSelector(({ contact }) => contact.contactsIds)
  const getRoomNonFriendProfilesRequest = useAppSelector(({ room }) => room.getRoomNonFriendProfilesRequest)

  useEffect(() => {
    if (roomType === "oneToOne") return

    const roomUsersIdWithoutContactsAndCurrentUser = currentRoomUsersId.filter((currentRoomUserId) => {
      return (
        contactsIds.indexOf(currentRoomUserId) === -1 &&
        currentRoomUserId !== currentUserId
      )
    })

    if (roomUsersIdWithoutContactsAndCurrentUser.length === 0) return

    const nonContactRoomUsersQuery = query(
      collection(firebase.firestore, "users"),
      where(documentId(), "in", roomUsersIdWithoutContactsAndCurrentUser)
    )

    const unsubscribe = onSnapshot(nonContactRoomUsersQuery, async (snapshot) => {
      const roomUsersProfile = await ContactService.getContactsProfile(snapshot.docs)
      const usersProfile: {
        [id: string]: UserProfile
      } = {}

      for (const userProfile of roomUsersProfile) {
        usersProfile[userProfile.id] = userProfile
      }

      dispatch(setRoomNonContactUsersProfile({ roomId, usersProfile: usersProfile }))
    })

    return () => unsubscribe()
  }, [currentRoomUsersId, contactsIds])

  return {
    getRoomNonFriendProfilesRequest
  }
}

export default useRoomNonFriendUsers