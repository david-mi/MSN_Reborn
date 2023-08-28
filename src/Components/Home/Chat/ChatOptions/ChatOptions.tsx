import { useState, useMemo } from "react"
import type { RoomType } from "@/redux/slices/room/types";
import ButtonWithImage from "@/Components/Shared/ButtonWithImage/ButtonWithImage";
import addUserToChatIcon from "./chat-add-user.png"
import InviteContactToRoomForm from "./InviteContactToRoomForm/InviteContactToRoomForm";
import { useAppSelector } from "@/redux/hooks";
import styles from "./chatOptions.module.css";

interface Props {
  roomType: RoomType
  users: string[]
  roomId: string
}

function ChatOptions({ roomType, users, roomId }: Props) {
  const [inviteContactToRoomFormOpen, setInviteContactToRoomFormOpen] = useState(false)
  const contactsProfile = useAppSelector(({ contact }) => contact.contactsProfile)
  const contactsOutsideCurrentRoom = useMemo(() => {
    return Object
      .values(contactsProfile)
      .filter((contact) => users.includes(contact.id) === false)
  }, [contactsProfile, users])

  function toggleInviteContactToRoomForm() {
    setInviteContactToRoomFormOpen((state) => !state)
  }

  let optionsContent: JSX.Element

  if (roomType === "oneToOne") {
    optionsContent = (
      <ButtonWithImage
        onClick={toggleInviteContactToRoomForm}
        src={addUserToChatIcon}
        className={styles.addContactButton}
        disabled={contactsOutsideCurrentRoom.length === 0}
      />
    )
  } else {
    optionsContent = (
      <ButtonWithImage
        onClick={toggleInviteContactToRoomForm}
        src={addUserToChatIcon}
        className={styles.addContactButton}
      />
    )
  }

  return (
    <div className={styles.chatOptions}>
      {inviteContactToRoomFormOpen && (
        <InviteContactToRoomForm
          toggleInviteContactToRoomForm={toggleInviteContactToRoomForm}
          contactsOutsideCurrentRoom={contactsOutsideCurrentRoom}
          roomId={roomId}
        />
      )}
      {optionsContent}
    </div>
  );
}

export default ChatOptions;