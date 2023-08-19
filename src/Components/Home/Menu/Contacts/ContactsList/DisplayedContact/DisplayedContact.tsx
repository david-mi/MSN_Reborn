import { Contact } from "@/redux/slices/contact/types";
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";
import { ImageLoadWrapper, Avatar } from "@/Components/Shared";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setcurrentDisplayedRoom } from "@/redux/slices/room/room";
import styles from "./displayedContact.module.css";

interface Props {
  contact: Contact
}

function DisplayedContact({ contact }: Props) {
  const { username, displayedStatus, avatarSrc, personalMessage, roomId, id } = contact
  const dispatch = useAppDispatch()
  const currentRoomId = useAppSelector(({ room }) => room.currentRoomId)
  const unreadMessagesCount = useAppSelector(({ room }) => {
    const contactRoom = room.roomsList.find((room) => room.id === contact.roomId)!
    return contactRoom?.unreadMessagesCount
  })

  function handleContactClick(roomId: string) {
    if (roomId !== currentRoomId) {
      dispatch(setcurrentDisplayedRoom(roomId))
    }
  }

  return (
    <li
      className={styles.displayedContact}
      key={id}
      onClick={() => handleContactClick(roomId)}
    >
      <div className={styles.avatarContainer}>
        <Avatar src={avatarSrc} size="small" />
        <ImageLoadWrapper
          imageProps={{ src: statusesObject[displayedStatus].icon, alt: "icône du status de l'utilisateur" }}
          loaderOptions={{ size: "16px", thickness: "2px" }}
        />
        {unreadMessagesCount && currentRoomId !== roomId
          ? <p className={styles.unreadMessagesCount}>{unreadMessagesCount}</p>
          : null
        }
      </div>
      <span>{username}</span>
      <small> {personalMessage}</small>
    </li >
  );
}

export default DisplayedContact;