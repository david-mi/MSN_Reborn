import {
  ChatHeader,
  ChatOptions,
  ChatAvatars,
  ChatDisplayMessages,
  ChatSendMessage
} from ".";
import styles from "./chat.module.css";

function Chat() {
  return (
    <div className={styles.chat}>
      <ChatHeader />
      <ChatOptions />
      <ChatAvatars />
      <ChatDisplayMessages />
      <ChatSendMessage />
    </div>
  );
}

export default Chat;