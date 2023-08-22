import { Message, RoomUsersProfile } from "@/redux/slices/room/types";
import styles from "./chatMessages.module.css";
import ChatMessage from "./ChatMessage/ChatMessage";

interface Props {
  messages: Message[],
  usersProfile: RoomUsersProfile
  roomId: string
}

function ChatMessages({ messages, usersProfile, roomId }: Props) {

  function shouldDisplayAllMessageInfos(currentMessageIndex: number, currentMessage: Message) {
    if (currentMessageIndex === 0) {
      return true
    }

    const previousMessage = messages[currentMessageIndex - 1]

    if (previousMessage.userId !== currentMessage.userId) {
      return true
    }

    const areMessagesPostedAtDifferentHours = (
      new Date(currentMessage.createdAt).getHours() !==
      new Date(previousMessage.createdAt).getHours()
    )

    return areMessagesPostedAtDifferentHours
  }

  return (
    <div className={styles.chatDisplayMessages}>
      {messages.map((message, index) => {
        return (
          <ChatMessage
            displayAllInfos={shouldDisplayAllMessageInfos(index, message)}
            key={message.id}
            roomId={roomId}
            message={message}
            user={usersProfile[message.userId]} />
        )
      })}
    </div>
  );
}

export default ChatMessages;