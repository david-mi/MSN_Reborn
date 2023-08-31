import { useEffect, useMemo } from "react"
import { onSnapshot, query, where, documentId, collection } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ContactService } from "@/Services";
import { setRoomNonContactUsersProfile } from "@/redux/slices/room/room";
import { UserProfile } from "@/redux/slices/user/types";
import { RoomType } from "@/redux/slices/room/types";

function useRoomUsers(roomId: string, roomType: RoomType) {
  const dispatch = useAppDispatch()
  const getRoomNonFriendProfilesRequest = useAppSelector(({ room }) => room.getRoomNonFriendProfilesRequest)
  const currentUser = useAppSelector(({ user }) => user)
  const currentRoom = useAppSelector(({ room }) => room.roomsList[room.currentRoomId as string])
  const currentRoomUsersId = currentRoom.users
  const contactsProfile = useAppSelector(({ contact }) => contact.contactsProfile)
  const contactsIds = useAppSelector(({ contact }) => contact.contactsIds)
  const { currentRoomUsersProfile, currentRoomUsersProfileList } = useMemo(() => {
    const currentRoomUsersProfileList: UserProfile[] = Object.values(currentRoom.usersProfile)
    const currentRoomUsersProfile: { [userId: string]: UserProfile } = {
      ...currentRoom.usersProfile
    }

    for (const contactId in contactsProfile) {
      const contactProfile = contactsProfile[contactId]

      if (currentRoomUsersId.indexOf(contactId) !== -1) {
        currentRoomUsersProfileList.push(contactProfile)
        currentRoomUsersProfile[contactId] = contactProfile
      }
    }

    return { currentRoomUsersProfileList, currentRoomUsersProfile }
  }, [contactsProfile, currentRoom.usersProfile, currentRoomUsersId])

  useEffect(() => {
    if (roomType === "oneToOne") return

    const roomUsersIdWithoutContactsAndCurrentUser = currentRoomUsersId.filter((currentRoomUserId) => {
      return (
        contactsIds.indexOf(currentRoomUserId) === -1 &&
        currentRoomUserId !== currentUser.id
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
    getRoomNonFriendProfilesRequest,
    currentRoomUsersProfileList,
    currentRoomUsersProfile
  }
}

export default useRoomUsers