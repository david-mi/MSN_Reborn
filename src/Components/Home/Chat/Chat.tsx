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
import { Loader } from "@/Components/Shared";
import { useRef } from "react"

function Chat() {
  const { id, usersProfile, messages, users } = useAppSelector(({ room }) => {
    const currentRoomId = room.currentRoomId
    return room.roomsList[currentRoomId as string]
  })
  const getRoomUsersProfileRequest = useAppSelector(({ room }) => room.getRoomUsersProfileRequest)
  useRoomUsers(id)
  const shouldScrollToBottomRef = useRef<boolean>(true)

  return (
    <div className={styles.chat}>
      <ChatHeader />
      <ChatOptions />
      <ChatAvatars />
      {getRoomUsersProfileRequest.status === "PENDING"
        ? <Loader size="2rem" />
        : (
          <ChatMessages
            shouldScrollToBottomRef={shouldScrollToBottomRef}
            roomId={id}
            messages={messages}
            usersProfile={usersProfile}
          />
        )
      }
      <ChatForm
        shouldScrollToBottomRef={shouldScrollToBottomRef}
        roomId={id}
        users={users}
      />
    </div>
  );
}

export default Chat;