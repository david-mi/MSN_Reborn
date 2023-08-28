import { Avatar } from "@/Components/Shared";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setcurrentDisplayedRoom } from "@/redux/slices/room/room";
import styles from "./displayedCustomRoom.module.css";
import { Room } from "@/redux/slices/room/types";

interface Props {
  room: Room
}

function DisplayedCustomRoom({ room }: Props) {
  const { unreadMessagesCount, id: roomId } = room
  const dispatch = useAppDispatch()
  const currentRoomId = useAppSelector(({ room }) => room.currentRoomId)

  function handleCustomRoomClick(roomId: string) {
    if (roomId !== currentRoomId) {
      dispatch(setcurrentDisplayedRoom(roomId))
    }
  }

  return (
    <li
      className={styles.displayedCustomRoom}
      key={roomId}
      onClick={() => handleCustomRoomClick(roomId)}
    >
      <div className={styles.avatarContainer}>
        <Avatar size="small" />
        {unreadMessagesCount && currentRoomId !== room.id
          ? <p className={styles.unreadMessagesCount}>{unreadMessagesCount}</p>
          : null
        }
      </div>
      <p className={styles.roomName}>{room.name}</p>
    </li >
  );
}

export default DisplayedCustomRoom;