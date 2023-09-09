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
  const { id, messages, usersId, type, previousMessagesScrollTop } = room
  const getCurrentUserProfileStatus = useAppSelector(({ user }) => user.getProfile.status)
  const getContactsProfileStatus = useAppSelector(({ contact }) => contact.getContactsProfile.status)
  const { getRoomNonFriendProfilesRequest, currentRoomUsersProfile } = useRoomUsers(id, type)
  const shouldScrollToBottomRef = useRef<boolean>(true)
  const [displayUsersPanel, setDisplayUsersPanel] = useState(matchMedia("(min-width: 850px)").matches)
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
      <ChatHeader room={room} currentRoomUsersProfile={currentRoomUsersProfile} />
      <ChatOptions
        roomType={type}
        usersId={usersId}
        currentRoomUsersProfile={currentRoomUsersProfile}
        displayUsersPanel={displayUsersPanel}
        setDisplayUsersPanel={setDisplayUsersPanel}
      />
      <div className={styles.messagesAndUsersPanel}>
        <ChatMessages
          key={id}
          shouldScrollToBottomRef={shouldScrollToBottomRef}
          roomId={id}
          roomType={type}
          messages={messages}
          currentRoomUsersProfile={currentRoomUsersProfile}
          previousMessagesScrollTop={previousMessagesScrollTop}
        />
        {type === "manyToMany" && displayUsersPanel && (
          <ChatUsersPanel currentRoomUsersProfile={currentRoomUsersProfile} />
        )}
      </div>
      <ChatForm
        shouldScrollToBottomRef={shouldScrollToBottomRef}
        roomId={id}
        usersId={usersId}
      />
    </div>
  );
}

export default Chat;