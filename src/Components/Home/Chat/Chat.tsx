import useRoomUsers from "@/hooks/useRoomUsers";
import {
  ChatHeader,
  ChatOptions,
  ChatAvatars,
  ChatDisplayMessages,
  ChatSendMessage
} from ".";
import styles from "./chat.module.css";
import { useAppSelector } from "@/redux/hooks";

function Chat() {
  const { id, usersProfile, messages } = useAppSelector(({ room }) => {
    return room.roomsList.find((roomToFind) => roomToFind.id === room.currentRoomId)!
  })
  useRoomUsers(id)

  return (
    <div className={styles.chat}>
      <ChatHeader />
      <ChatOptions />
      <ChatAvatars />
      <ChatDisplayMessages
        messages={messages}
        usersProfile={usersProfile}
      />
      <ChatSendMessage roomId={id} />
    </div>
  );
}

export default Chat;