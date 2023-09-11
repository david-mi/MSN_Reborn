import { useEffect, useMemo, useRef } from "react"
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRoomNonFriendUsersProfile } from "@/redux/slices/room/room";
import { UserProfile } from "@/redux/slices/user/types";
import { RoomType, UserId } from "@/redux/slices/room/types";
import { onValue, ref, Unsubscribe } from "firebase/database";
import { UserService } from "@/Services";

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

      if (currentRoom.users[contactId] !== undefined) {
        currentRoomUsersProfile.set(contactId, contactProfile)
      }
    }

    return currentRoomUsersProfile
  }, [contactsProfile, currentRoom.nonFriendUsersProfile, currentRoom.users])
  const nonFriendUsersProfileUnsubscribeList = useRef<Unsubscribe[]>([])

  useEffect(() => {
    if (roomType === "oneToOne") return

    (async function () {
      const nonFriendUsers = Object
        .entries(currentRoom.users)
        .reduce<{ unsubscribed: UserId[], subscribed: UserId[] }>((nonFriendUsers, [userId, isSubscribed]) => {
          if (contactsIds.indexOf(userId) !== -1 || userId === currentUser.id) {
            return nonFriendUsers
          }

          if (isSubscribed) {
            nonFriendUsers.subscribed.push(userId)
          } else {
            nonFriendUsers.unsubscribed.push(userId)
          }

          return nonFriendUsers
        }, { unsubscribed: [], subscribed: [] })

      const nonFriendUsersProfile: { [id: string]: UserProfile } = {}

      for (const userId of nonFriendUsers.unsubscribed) {
        const nonFriendUnsubscribedUserProfile = await UserService.getProfile(userId)
        nonFriendUsersProfile[nonFriendUnsubscribedUserProfile.id] = nonFriendUnsubscribedUserProfile

        dispatch(setRoomNonFriendUsersProfile({ roomId, nonFriendUsersProfile: nonFriendUsersProfile }))
      }

      if (nonFriendUsers.subscribed.length === 0) return

      for (const userId of nonFriendUsers.subscribed) {
        const subscribedNonFriendUserProfileRef = ref(firebase.database, `profiles/${userId}`)

        const unsubscribeNonRoomUserProfile = onValue(subscribedNonFriendUserProfileRef, async (snapshot) => {
          const subscribedNonFriendUserProfile = {
            ...snapshot.val(),
            id: snapshot.key
          } as UserProfile


          nonFriendUsersProfile[subscribedNonFriendUserProfile.id] = subscribedNonFriendUserProfile

          dispatch(setRoomNonFriendUsersProfile({ roomId, nonFriendUsersProfile }))
        })

        nonFriendUsersProfileUnsubscribeList.current.push(unsubscribeNonRoomUserProfile)
      }
    })()

    return () => {
      nonFriendUsersProfileUnsubscribeList.current.forEach((unSubscribeNonFriendUserProfile) => {
        unSubscribeNonFriendUserProfile()
        nonFriendUsersProfileUnsubscribeList.current = []
      })
    }
  }, [currentRoom.users, contactsIds])

  return {
    getRoomNonFriendProfilesRequest,
    currentRoomUsersProfile
  }
}

export default useRoomUsers