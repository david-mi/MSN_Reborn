import { useState, useMemo, Dispatch, SetStateAction } from "react"
import type { RoomType, RoomUsers } from "@/redux/slices/room/types";
import ButtonWithImage from "@/Components/Shared/ButtonWithImage/ButtonWithImage";
import addUserToChatIcon from "./chat-add-user.png"
import InviteContactToRoomForm from "./InviteContactToRoomForm/InviteContactToRoomForm";
import { useAppSelector } from "@/redux/hooks";
import { UserProfile } from "@/redux/slices/user/types";
import styles from "./chatOptions.module.css";
import { ButtonWithSvg } from "@/Components/Shared";
import LeaveRoomAlert from "./LeaveRoomAlert/LeaveRoomAlert";
import DeleteRoomAlert from "./DeleteRoomAlert/DeleteRoomAlert";

interface Props {
  roomType: RoomType
  users: RoomUsers
  currentRoomUsersProfile: Map<string, UserProfile>
  displayUsersPanel: boolean
  setDisplayUsersPanel: Dispatch<SetStateAction<boolean>>
  roomName: string | null
}

function ChatOptions(props: Props) {
  const { roomType, users, currentRoomUsersProfile, displayUsersPanel, setDisplayUsersPanel, roomName } = props

  const [inviteContactToRoomFormOpen, setInviteContactToRoomFormOpen] = useState(false)
  const [displayDeleteRoomAlert, setDisplayDeleteRoomAlert] = useState(false)
  const [displayLeaveRoomAlert, setDisplayLeaveRoomAlert] = useState(false)
  const currentUserId = useAppSelector(({ user }) => user.id)
  const contactsProfile = useAppSelector(({ contact }) => contact.contactsProfile)
  const unsubscribedContacts = useMemo(() => {
    return Object
      .values(contactsProfile)
      .filter((contact) => !users.subscribed[contact.id])
  }, [contactsProfile, users])
  const usersPanelClassName = displayUsersPanel ? styles.isOpen : ""

  function toggleInviteContactToRoomForm() {
    setInviteContactToRoomFormOpen((state) => !state)
  }

  function toggleUsersPanel() {
    setDisplayUsersPanel((state) => !state)
  }

  function toggleLeaveRoomAlert() {
    setDisplayLeaveRoomAlert((state) => !state)
  }

  function toggleDeleteRoomAlert() {
    setDisplayDeleteRoomAlert((state) => !state)
  }

  return (
    <div className={styles.chatOptions}>
      {displayDeleteRoomAlert && (
        <DeleteRoomAlert
          roomName={roomName as string}
          setDisplayDeleteRoomAlert={setDisplayDeleteRoomAlert}
          subscribedRoomUsers={users.subscribed}
        />
      )}
      {displayLeaveRoomAlert && <LeaveRoomAlert roomName={roomName as string} setDisplayLeaveRoomAlert={setDisplayLeaveRoomAlert} />}
      {inviteContactToRoomFormOpen && (
        <InviteContactToRoomForm
          roomType={roomType}
          toggleInviteContactToRoomForm={toggleInviteContactToRoomForm}
          unsubscribedContacts={unsubscribedContacts}
          currentRoomUsersProfile={currentRoomUsersProfile}
        />
      )}
      <ButtonWithImage
        onClick={toggleInviteContactToRoomForm}
        src={addUserToChatIcon}
        className={styles.addContactButton}
        disabled={unsubscribedContacts.length === 0}
      />
      {roomType === "manyToMany" && (
        <>
          {users.subscribed[currentUserId].role === "admin" && (
            <ButtonWithSvg onClick={toggleDeleteRoomAlert} className={styles.leaveRoom}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm3.17-6.41a.996.996 0 1 1 1.41-1.41L12 12.59l1.41-1.41a.996.996 0 1 1 1.41 1.41L13.41 14l1.41 1.41a.996.996 0 1 1-1.41 1.41L12 15.41l-1.41 1.41a.996.996 0 1 1-1.41-1.41L10.59 14l-1.42-1.41zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
              </svg>

            </ButtonWithSvg>
          )}
          <ButtonWithSvg onClick={toggleLeaveRoomAlert} className={styles.leaveRoom}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <g fill="currentColor">
                <path fillRule="evenodd" d="M15.347 7.116a.5.5 0 0 1 .704.064l2.083 2.5a.5.5 0 0 1-.768.64l-2.083-2.5a.5.5 0 0 1 .064-.704Z" clipRule="evenodd"></path>
                <path fillRule="evenodd" d="M15.347 12.884a.5.5 0 0 1-.064-.704l2.083-2.5a.5.5 0 1 1 .768.64l-2.083 2.5a.5.5 0 0 1-.704.064Z" clipRule="evenodd"></path><path fillRule="evenodd" d="M17.5 10a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1 0-1H17a.5.5 0 0 1 .5.5Zm-14-7a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5Zm0 14a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5Z" clipRule="evenodd"></path><path fillRule="evenodd" d="M13 2.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5Zm0 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5Zm-9-10a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5Z" clipRule="evenodd"></path>
                <path d="M1.15 1.878a.514.514 0 0 1 .728-.727l16.971 16.971a.514.514 0 0 1-.727.727L1.151 1.878Z"></path>
              </g>
            </svg>
          </ButtonWithSvg>
          <ButtonWithSvg onClick={toggleUsersPanel}>
            <svg className={usersPanelClassName} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11.5 16V8l-4 4l4 4ZM5 19h9V5H5v14Zm-2 2V3h18v18H3Z"></path>
            </svg>
          </ButtonWithSvg>
        </>
      )}
    </div>
  );
}

export default ChatOptions;