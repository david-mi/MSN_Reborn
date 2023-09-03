import { useState, useMemo, Dispatch, SetStateAction } from "react"
import type { RoomType } from "@/redux/slices/room/types";
import ButtonWithImage from "@/Components/Shared/ButtonWithImage/ButtonWithImage";
import addUserToChatIcon from "./chat-add-user.png"
import InviteContactToRoomForm from "./InviteContactToRoomForm/InviteContactToRoomForm";
import { useAppSelector } from "@/redux/hooks";
import styles from "./chatOptions.module.css";
import { UserProfile } from "@/redux/slices/user/types";

interface Props {
  roomType: RoomType
  users: string[]
  currentRoomUsersProfileList: UserProfile[]
  setDisplayUsersPanel: Dispatch<SetStateAction<boolean>>
}

function ChatOptions({ roomType, users, currentRoomUsersProfileList, setDisplayUsersPanel }: Props) {
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

  function toggleUsersPanel() {
    setDisplayUsersPanel((state) => !state)
  }

  return (
    <div className={styles.chatOptions}>
      {inviteContactToRoomFormOpen && (
        <InviteContactToRoomForm
          roomType={roomType}
          toggleInviteContactToRoomForm={toggleInviteContactToRoomForm}
          contactsOutsideCurrentRoom={contactsOutsideCurrentRoom}
          currentRoomUsersProfileList={currentRoomUsersProfileList}
        />
      )}
      <ButtonWithImage
        onClick={toggleInviteContactToRoomForm}
        src={addUserToChatIcon}
        className={styles.addContactButton}
        disabled={contactsOutsideCurrentRoom.length === 0}
      />
      <button onClick={toggleUsersPanel}>toggle</button>
    </div>
  );
}

export default ChatOptions;