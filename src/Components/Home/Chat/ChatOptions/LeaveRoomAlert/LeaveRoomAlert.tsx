import { Avatar, ModaleLayout, Button } from "@/Components/Shared";
import { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./leaveRoomAlert.module.css";
import { leaveRoom } from "@/redux/slices/room/room";

interface Props {
  roomName: string,
  roomAvatarSrc?: string
  setDisplayLeaveRoomAlert: Dispatch<SetStateAction<boolean>>
}

function LeaveRoomAlert({ roomName, roomAvatarSrc, setDisplayLeaveRoomAlert }: Props) {
  const dispatch = useAppDispatch()
  const request = useAppSelector(({ room }) => room.leaveRoomRequest)
  const roomId = useAppSelector(({ room }) => room.currentRoomId as string)

  function closeLeaveRoomAlert() {
    setDisplayLeaveRoomAlert(false)
  }

  async function handleAcceptButtonClick() {
    try {
      await dispatch(leaveRoom(roomId)).unwrap()
      closeLeaveRoomAlert()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ModaleLayout
      title={"Quitter un salon"}
      closable
      onCloseButtonClick={closeLeaveRoomAlert}
      overlay
    >
      <div className={styles.container}>
        <div className={styles.infos}>
          <p className={styles.title}>Quitter le salon</p>
          <p className={styles.roomName}>{roomName} ?</p>
          <Avatar size="medium" src={roomAvatarSrc} />
          <small>Le salon ne figurera plus dans votre liste</small>
        </div>
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
            onClick={closeLeaveRoomAlert}
          />
          <small>{request.error}</small>
        </div>
      </div>
    </ModaleLayout>
  );
}

export default LeaveRoomAlert;