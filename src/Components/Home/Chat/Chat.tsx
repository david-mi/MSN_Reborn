import { Room } from "@/redux/slices/room/types";
import {
  ChatHeader,
  ChatOptions,
  ChatAvatars,
  ChatDisplayMessages,
  ChatSendMessage
} from ".";
import styles from "./chat.module.css";

interface Props {
  currentRoom: Room
}

function Chat({ currentRoom }: Props) {
  return (
    <div className={styles.chat}>
      <ChatHeader />
      <ChatOptions />
      <ChatAvatars />
      <ChatDisplayMessages />
      <ChatSendMessage roomId={currentRoom.id} />
    </div>
  );
}

export default Chat;