import { useEffect } from "react"
import { getDoc, onSnapshot } from "firebase/firestore";
import { doc } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import { UserService } from "@/Services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPendingRoomsInvitation } from "@/redux/slices/room/room";
import { DataBasePendingRoomInvitation, DatabaseCustomRoom, PendingRoomInvitation } from "@/redux/slices/room/types";
import { UserProfile } from "@/redux/slices/user/types";
import { ref, get } from "firebase/database";

function useRoomInvitation() {
  const dispatch = useAppDispatch()
  const pendingRoomsInvitation = useAppSelector(({ room }) => room.pendingRoomsInvitation)

  useEffect(() => {
    const receivedRoomInvitation = doc(firebase.firestore, "receivedRoomRequests", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(receivedRoomInvitation, async (snapshot) => {
      if (snapshot.data() === undefined) return
      const pendingRoomsInvitation = snapshot.data() as DataBasePendingRoomInvitation

      const pendingRoomsInvitationToSend: PendingRoomInvitation[] = []

      for (const roomInvitationId in pendingRoomsInvitation) {
        const roomRef = pendingRoomsInvitation[roomInvitationId]

        const roomSnapshot = await getDoc(roomRef)
        const { name: roomName, users } = roomSnapshot.data() as DatabaseCustomRoom

        const pendingRoomInvitationToSend: PendingRoomInvitation = {
          id: roomInvitationId,
          roomId: roomSnapshot.id,
          roomName,
          roomUsersProfile: {}
        }

        for (const roomUserId in users.subscribed) {
          const roomUserProfileRef = ref(firebase.database, `profiles/${roomUserId}`)

          const roomUserProfileSnapshot = await get(roomUserProfileRef)
          roomUserProfileSnapshot.key
          const roomUserProfile = {
            ...roomUserProfileSnapshot.val(),
            id: roomUserProfileSnapshot.key
          } as UserProfile

          pendingRoomInvitationToSend.roomUsersProfile[roomUserProfile.id] = roomUserProfile
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