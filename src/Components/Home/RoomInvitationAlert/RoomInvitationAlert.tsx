import { ModaleLayout, Button } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { PendingRoomInvitation } from "@/redux/slices/room/types";
import RoomUsersProfile from "./RoomUsersProfile/RoomUsersProfile";
import styles from "./roomInvitationAlert.module.css"

interface Props {
  roomInfos: PendingRoomInvitation
}

function RoomInvitationAlert({ roomInfos }: Props) {
  const { roomName, roomUsersProfile, id } = roomInfos

  const dispatch = useAppDispatch()
  const request = useAppSelector(({ contact }) => contact.request)

  function handleAcceptButtonClick() {
    console.log("accept")
    // dispatch(acceptRoomInvitation(id))
  }

  function handleDenyButtonClick() {
    console.log("deny")
    // dispatch(denyRoomInvitation(id))
  }

  return (
    <ModaleLayout title="Invitation dans un salon" closable overlay>
      <div className={styles.container}>
        <h2 className={styles.roomName}>{roomName}</h2>
        <h3 className={styles.roomMembersTitle}>Membres</h3>
        <RoomUsersProfile roomUsersProfile={roomUsersProfile} />
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