import { useEffect, useMemo, useRef } from "react"
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRoomNonFriendUsersProfile } from "@/redux/slices/room/room";
import { UserProfile } from "@/redux/slices/user/types";
import { RoomType, UserId } from "@/redux/slices/room/types";
import { onValue, ref, Unsubscribe } from "firebase/database";

function useRoomUsers(roomId: string, roomType: RoomType) {
  const dispatch = useAppDispatch()
  const getRoomNonFriendProfilesRequest = useAppSelector(({ room }) => room.getRoomNonFriendProfilesRequest)
  const currentUser = useAppSelector(({ user }) => user)
  const currentRoom = useAppSelector(({ room }) => room.roomsList[room.currentRoomId as string])
  const contactsProfile = useAppSelector(({ contact }) => contact.contactsProfile)
  const contactsIds = useAppSelector(({ contact }) => contact.contactsIds)
  const currentRoomUsersProfile = useMemo(() => {
    const currentRoomUsersProfile = new Map<UserId, UserProfile>(Object.entries(currentRoom.nonFriendUsersProfile))

    for (const contactId in contactsProfile) {
      const contactProfile = contactsProfile[contactId]

      if (currentRoom.usersId.indexOf(contactId) !== -1) {
        currentRoomUsersProfile.set(contactId, contactProfile)
      }
    }

    return currentRoomUsersProfile
  }, [contactsProfile, currentRoom.nonFriendUsersProfile, currentRoom.usersId])
  const nonFriendUsersProfileUnsubscribeList = useRef<Unsubscribe[]>([])

  useEffect(() => {
    if (roomType === "oneToOne") return

    const roomUsersIdWithoutContactsAndCurrentUser = currentRoom.usersId.filter((currentRoomUserId) => {
      return (
        contactsIds.indexOf(currentRoomUserId) === -1 &&
        currentRoomUserId !== currentUser.id
      )
    })

    if (roomUsersIdWithoutContactsAndCurrentUser.length === 0) return

    const nonFriendUsersProfile: {
      [id: string]: UserProfile
    } = {}

    for (const userId of roomUsersIdWithoutContactsAndCurrentUser) {
      const nonRoomUserProfileRef = ref(firebase.database, `profiles/${userId}`)

      const unsubscribeNonRoomUserProfile = onValue(nonRoomUserProfileRef, async (snapshot) => {
        const nonRoomUserProfile = {
          ...snapshot.val(),
          id: snapshot.key
        } as UserProfile

        nonFriendUsersProfile[nonRoomUserProfile.id] = nonRoomUserProfile

        dispatch(setRoomNonFriendUsersProfile({ roomId, nonFriendUsersProfile }))
      })

      nonFriendUsersProfileUnsubscribeList.current.push(unsubscribeNonRoomUserProfile)
    }

    return () => {
      nonFriendUsersProfileUnsubscribeList.current.forEach((unSubscribeMessageCallback) => {
        unSubscribeMessageCallback()
        nonFriendUsersProfileUnsubscribeList.current = []
      })
    }
  }, [currentRoom.usersId, contactsIds])

  return {
    getRoomNonFriendProfilesRequest,
    currentRoomUsersProfile
  }
}

export default useRoomUsers