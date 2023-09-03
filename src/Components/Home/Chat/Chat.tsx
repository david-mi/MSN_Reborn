import useRoomUsers from "@/hooks/useRoomUsers";
import {
  ChatHeader,
  ChatOptions,
  ChatUsersPanel,
  ChatMessages,
  ChatForm
} from ".";
import styles from "./chat.module.css";
import { useAppSelector } from "@/redux/hooks";
import { useRef, useState } from "react"
import { Loader } from "@/Components/Shared";

function Chat() {
  const room = useAppSelector(({ room }) => room.roomsList[room.currentRoomId as string])
  const { id, messages, users, type } = room
  const getCurrentUserProfileStatus = useAppSelector(({ user }) => user.getProfile.status)
  const getContactsProfileStatus = useAppSelector(({ contact }) => contact.getContactsProfile.status)
  const {
    getRoomNonFriendProfilesRequest,
    currentRoomUsersProfileList,
    currentRoomUsersProfile
  } = useRoomUsers(id, type)
  const shouldScrollToBottomRef = useRef<boolean>(true)
  const [displayUsersPanel, setDisplayUsersPanel] = useState(true)
  const classNames = `${styles.chat} ${styles[type]}`

  if (
    getCurrentUserProfileStatus === "PENDING" ||
    getContactsProfileStatus === "PENDING" ||
    getRoomNonFriendProfilesRequest.status === "PENDING"
  ) {
    return <Loader size={"3rem"} />
  }

  return (
    <div className={classNames}>
      <ChatHeader room={room} currentRoomUsersProfileList={currentRoomUsersProfileList} />
      <ChatOptions
        roomType={type}
        users={users}
        currentRoomUsersProfileList={currentRoomUsersProfileList}
        setDisplayUsersPanel={setDisplayUsersPanel}
      />
      {type === "manyToMany" && displayUsersPanel && (
        <ChatUsersPanel currentRoomUsersProfileList={currentRoomUsersProfileList} />
      )}
      <ChatMessages
        shouldScrollToBottomRef={shouldScrollToBottomRef}
        roomId={id}
        roomType={type}
        messages={messages}
        currentRoomUsersProfile={currentRoomUsersProfile}
        currentRoomUsersProfileList={currentRoomUsersProfileList}
      />
      <ChatForm
        shouldScrollToBottomRef={shouldScrollToBottomRef}
        roomId={id}
        users={users}
      />
    </div>
  );
}

export default Chat;