import { useState, useMemo } from "react"
import type { RoomType, RoomUsersProfile } from "@/redux/slices/room/types";
import ButtonWithImage from "@/Components/Shared/ButtonWithImage/ButtonWithImage";
import addUserToChatIcon from "./chat-add-user.png"
import InviteContactToRoomForm from "./InviteContactToRoomForm/InviteContactToRoomForm";
import { useAppSelector } from "@/redux/hooks";
import styles from "./chatOptions.module.css";

interface Props {
  roomType: RoomType
  usersProfile: RoomUsersProfile
}

function ChatOptions({ roomType, usersProfile }: Props) {
  const [inviteContactToRoomFormOpen, setInviteContactToRoomFormOpen] = useState(false)
  const contactsList = useAppSelector(({ contact }) => contact.contactsList)
  const contactsOutsideCurrentRoom = useMemo(() => {
    return contactsList.filter((contact) => {
      return !Object
        .values(usersProfile)
        .find((userProfile) => userProfile.id === contact.id)
    })
  }, [contactsList, usersProfile])

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
        />
      )}
      {optionsContent}
    </div>
  );
}

export default ChatOptions;