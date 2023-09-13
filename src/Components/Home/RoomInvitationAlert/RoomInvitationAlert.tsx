import { ModaleLayout, Button } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { PendingRoomInvitation } from "@/redux/slices/room/types";
import { acceptRoomInvitation, denyRoomInvitation } from "@/redux/slices/room/room";
import RoomUsersProfile from "./RoomUsersProfile/RoomUsersProfile";
import styles from "./roomInvitationAlert.module.css"

interface Props {
  roomInvitation: PendingRoomInvitation
}

function RoomInvitationAlert({ roomInvitation }: Props) {
  const { roomName, roomId, roomUsersProfile, id: invitationId } = roomInvitation
  const dispatch = useAppDispatch()
  const request = useAppSelector(({ contact }) => contact.request)
  const currentUserName = useAppSelector(({ user }) => user.username)

  function handleAcceptButtonClick() {
    dispatch(acceptRoomInvitation({ roomInvitationId: invitationId, roomId, username: currentUserName }))
  }

  function handleDenyButtonClick() {
    dispatch(denyRoomInvitation(invitationId))
  }

  return (
    <ModaleLayout title="Invitation dans un salon" closable overlay>
      <div className={styles.container}>
        <h2 className={styles.roomName}>{roomName}</h2>
        <h3 className={styles.roomMembersTitle}>Membres</h3>
        <RoomUsersProfile roomUsersProfileList={Object.values(roomUsersProfile)} />
        <div className={styles.submitButtonContainer}>
          <Button
            theme="gradient"
            title="Accepter"
            onClick={handleAcceptButtonClick}
            disabled={request.status === "PENDING"}
          />
          <Button
            theme="monochrome"
            title="Refuser"
            disabled={request.status === "PENDING"}
            onClick={handleDenyButtonClick}
          />
          <small>{request.error}</small>
        </div>
      </div>
    </ModaleLayout>
  );
}

export default RoomInvitationAlert;