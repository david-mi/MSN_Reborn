import { useEffect } from "react"
import { getDoc, onSnapshot } from "firebase/firestore";
import { doc } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import { UserService } from "@/Services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPendingRoomsInvitation } from "@/redux/slices/room/room";
import { DataBasePendingRoomInvitation, DatabaseRoom, PendingRoomInvitation } from "@/redux/slices/room/types";
import { UserProfile } from "@/redux/slices/user/types";

function useRoomInvitation() {
  const dispatch = useAppDispatch()
  const pendingRoomsInvitation = useAppSelector(({ room }) => room.pendingRoomsInvitation)

  useEffect(() => {
    const receivedRoomInvitation = doc(firebase.firestore, "receivedRoomRequests", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(receivedRoomInvitation, async (snapshot) => {
      if (snapshot.data() === undefined) return
      const pendingRoomsInvitation = snapshot.data() as DataBasePendingRoomInvitation

      const pendingRoomsInvitationToSend: PendingRoomInvitation[] = []

      for (const userId in pendingRoomsInvitation) {
        const { roomInvitationOriginRef, roomName } = pendingRoomsInvitation[userId]

        const pendingRoomInvitationToSend: PendingRoomInvitation = {
          id: snapshot.id,
          roomName,
          roomUsersProfile: []
        }

        const originRoomSnapshot = await getDoc(roomInvitationOriginRef)
        const originRoomData = originRoomSnapshot.data() as DatabaseRoom
        const originRoomUsers = originRoomData.users

        for (const originRoomUserId in originRoomUsers) {
          const originRoomUserProfileRef = doc(firebase.firestore, "users", originRoomUserId)
          const originRoomUserProfileSnapshot = await getDoc(originRoomUserProfileRef)

          const originRoomUserProfileData = {
            ...originRoomUserProfileSnapshot.data(),
            id: originRoomUserProfileSnapshot.id
          } as UserProfile

          pendingRoomInvitationToSend.roomUsersProfile.push(originRoomUserProfileData)
        }

        pendingRoomsInvitationToSend.push(pendingRoomInvitationToSend)
      }

      dispatch(setPendingRoomsInvitation(pendingRoomsInvitationToSend))
    })

    return () => unsubscribe()
  }, [])

  return {
    pendingRoomsInvitation,
    havePendingRoomInvitation: pendingRoomsInvitation.length !== 0,
  }
}

export default useRoomInvitation