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

function Chat() {
  const { id, usersProfile, messages, users } = useAppSelector(({ room }) => {
    return room.roomsList.find((roomToFind) => roomToFind.id === room.currentRoomId)!
  })
  useRoomUsers(id)

  return (
    <div className={styles.chat}>
      <ChatHeader />
      <ChatOptions />
      <ChatAvatars />
      <ChatMessages messages={messages} usersProfile={usersProfile} />
      <ChatForm roomId={id} users={users} />
    </div>
  );
}

export default Chat;