import useRoomUsers from "@/hooks/useRoomUsers";
import {
  ChatHeader,
  ChatOptions,
  ChatAvatars,
  ChatMessages,
  ChatForm
} from ".";
import styles from "./chat.module.css";
import { useAppSelector } from "@/redux/hooks";
import { useRef } from "react"
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
  const classNames = `${styles.chat} ${styles[type]}`

  if (
    getCurrentUserProfileStatus === "PENDING" ||
    getContactsProfileStatus === "PENDING"
  ) {
    return <Loader size={"3rem"} />
  }

  return (
    <div className={classNames}>
      <ChatHeader roomType={type} users={users} />
      <ChatOptions roomId={id} roomType={type} users={users} />
      {type === "manyToMany" && <ChatAvatars />}
      <ChatMessages
        getRoomNonFriendProfilesRequest={getRoomNonFriendProfilesRequest}
        shouldScrollToBottomRef={shouldScrollToBottomRef}
        roomId={id}
        messages={messages}
        usersProfile={usersProfile}
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