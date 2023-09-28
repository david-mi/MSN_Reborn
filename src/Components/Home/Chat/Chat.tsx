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
  const { id, messages, users, type, previousMessagesScrollTop, name, playWizz } = room
  const getCurrentUserProfileStatus = useAppSelector(({ user }) => user.getProfile.status)
  const getContactsProfileStatus = useAppSelector(({ contact }) => contact.getContactsProfile.status)
  const currentUserWizzShakeOption = useAppSelector(({ options }) => options.user.wizzShake)
  const { getRoomNonFriendProfilesRequest, currentRoomUsersProfile } = useRoomUsers(id, type)
  const shouldScrollToBottomRef = useRef<boolean>(true)
  const [displayUsersPanel, setDisplayUsersPanel] = useState(matchMedia("(min-width: 750px)").matches)

  const shouldPlayWizzShake = currentUserWizzShakeOption && playWizz
  const classNames = `${styles.chat} ${shouldPlayWizzShake ? styles.playWizz : ""}`
  const isEveryRoomUsersLoaded = currentRoomUsersProfile.size === (
    Object.keys(users.subscribed).length + Object.keys(users.unsubscribed).length
  )

  if (
    getCurrentUserProfileStatus === "PENDING" ||
    getContactsProfileStatus === "PENDING" ||
    getRoomNonFriendProfilesRequest.status === "PENDING" ||
    isEveryRoomUsersLoaded === false
  ) {
    return <Loader size={"3rem"} />
  }

  return (
    <div className={classNames}>
      <ChatHeader room={room} currentRoomUsersProfile={currentRoomUsersProfile} />
      <ChatOptions
        roomType={type}
        users={users}
        currentRoomUsersProfile={currentRoomUsersProfile}
        displayUsersPanel={displayUsersPanel}
        setDisplayUsersPanel={setDisplayUsersPanel}
        roomName={name}
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
          <ChatUsersPanel users={users} currentRoomUsersProfile={currentRoomUsersProfile} />
        )}
      </div>
      <ChatForm
        shouldScrollToBottomRef={shouldScrollToBottomRef}
        roomId={id}
        users={users}
      />
    </div>
  );
}

export default Chat;