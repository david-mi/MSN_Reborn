import { Avatar, ModaleLayout, Button } from "@/Components/Shared";
import { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./deleteRoomAlert.module.css";
import { deleteRoom } from "@/redux/slices/room/room";
import { SubscribedUser, UserId } from "@/redux/slices/room/types";

interface Props {
  roomName: string,
  roomAvatarSrc?: string
  subscribedRoomUsers: {
    [userId: UserId]: SubscribedUser
  }
  setDisplayDeleteRoomAlert: Dispatch<SetStateAction<boolean>>
}

function DeleteRoomAlert({ roomName, roomAvatarSrc, setDisplayDeleteRoomAlert, subscribedRoomUsers }: Props) {
  const dispatch = useAppDispatch()
  const request = useAppSelector(({ room }) => room.deleteRoomRequest)
  const currentRoomId = useAppSelector(({ room }) => room.currentRoomId)

  function closeDeleteRoomAlert() {
    setDisplayDeleteRoomAlert(false)
  }

  async function handleAcceptButtonClick() {
    try {
      await dispatch(deleteRoom({
        roomId: currentRoomId!,
        subscribedRoomUsers,
        roomName: roomName
      })).unwrap()
      closeDeleteRoomAlert()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ModaleLayout
      title={"Supprimer un salon"}
      closable
      onCloseButtonClick={closeDeleteRoomAlert}
      overlay
    >
      <div className={styles.container}>
        <div className={styles.infos}>
          <p className={styles.title}>Supprimer le salon</p>
          <p className={styles.roomName}>{roomName} ?</p>
          <Avatar size="medium" src={roomAvatarSrc} />
          <small>Le salon et ses messages seront entièrement supprimés</small>
        </div>
        <div className={styles.submitButtonContainer}>
          <Button
            theme="gradient"
            title="Supprimer"
            onClick={handleAcceptButtonClick}
            disabled={request.status === "PENDING"}
          />
          <Button
            theme="monochrome"
            title="Annuler"
            disabled={request.status === "PENDING"}
            onClick={closeDeleteRoomAlert}
          />
          <small>{request.error}</small>
        </div>
      </div>
    </ModaleLayout>
  );
}

export default DeleteRoomAlert;