import { useState, useMemo, Dispatch, SetStateAction } from "react"
import type { RoomType } from "@/redux/slices/room/types";
import ButtonWithImage from "@/Components/Shared/ButtonWithImage/ButtonWithImage";
import addUserToChatIcon from "./chat-add-user.png"
import InviteContactToRoomForm from "./InviteContactToRoomForm/InviteContactToRoomForm";
import { useAppSelector } from "@/redux/hooks";
import { UserProfile } from "@/redux/slices/user/types";
import ToggleUsersPanelButton from "./ToggleUsersPanelButton/ToggleUsersPanelButton";
import styles from "./chatOptions.module.css";

interface Props {
  roomType: RoomType
  users: string[]
  currentRoomUsersProfile: Map<string, UserProfile>
  displayUsersPanel: boolean
  setDisplayUsersPanel: Dispatch<SetStateAction<boolean>>
}

function ChatOptions(props: Props) {
  const { roomType, users, currentRoomUsersProfile, displayUsersPanel, setDisplayUsersPanel } = props

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


  return (
    <div className={styles.chatOptions}>
      {inviteContactToRoomFormOpen && (
        <InviteContactToRoomForm
          roomType={roomType}
          toggleInviteContactToRoomForm={toggleInviteContactToRoomForm}
          contactsOutsideCurrentRoom={contactsOutsideCurrentRoom}
          currentRoomUsersProfile={currentRoomUsersProfile}
        />
      )}
      <ButtonWithImage
        onClick={toggleInviteContactToRoomForm}
        src={addUserToChatIcon}
        className={styles.addContactButton}
        disabled={contactsOutsideCurrentRoom.length === 0}
      />
      {roomType === "manyToMany" && (
        <ToggleUsersPanelButton displayUsersPanel={displayUsersPanel} setDisplayUsersPanel={setDisplayUsersPanel} />
      )}
    </div>
  );
}

export default ChatOptions;