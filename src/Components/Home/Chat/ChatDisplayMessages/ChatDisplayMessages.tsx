import { Message, RoomUsersProfile } from "@/redux/slices/room/types";
import styles from "./chatDisplayMessages.module.css";

interface Props {
  messages: Message[],
  usersProfile: RoomUsersProfile
}

function ChatDisplayMessages({ messages, usersProfile }: Props) {
  return (
    <div className={styles.chatDisplayMessages}>
      {messages.map((message) => {
        return (
          <div key={message.id} className={styles.message}>
            <h3>"{usersProfile[message?.userId]?.username}"</h3>
            <p>message: {message.message}</p>
            <small>createdAt: {message.createdAt}</small>
          </div>
        )
      })}
    </div>
  );
}

export default ChatDisplayMessages;