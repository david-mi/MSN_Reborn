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
  const currentRoom = useAppSelector(({ room }) => {
    return room.roomsList.find((roomToFind) => roomToFind.id === room.currentRoomId)!
  })

  return (
    <div className={styles.chat}>
      <ChatHeader />
      <ChatOptions />
      <ChatAvatars />
      <ChatDisplayMessages messages={currentRoom.messages} />
      <ChatSendMessage roomId={currentRoom.id} />
    </div>
  );
}

export default Chat;