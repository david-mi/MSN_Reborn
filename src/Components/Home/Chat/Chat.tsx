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

function Chat() {
  const { id, usersProfile, messages, users } = useAppSelector(({ room }) => {
    const currentRoomId = room.currentRoomId
    return room.roomsList[currentRoomId as string]
  })
  const getRoomUsersProfileRequest = useAppSelector(({ room }) => room.getRoomUsersProfileRequest)
  useRoomUsers(id)

  return (
    <div className={styles.chat}>
      <ChatHeader />
      <ChatOptions />
      <ChatAvatars />
      {getRoomUsersProfileRequest.status === "PENDING"
        ? <Loader size="2rem" />
        : (
          <ChatMessages
            roomId={id}
            messages={messages}
            usersProfile={usersProfile}
          />
        )
      }
      <ChatForm roomId={id} users={users} />
    </div>
  );
}

export default Chat;