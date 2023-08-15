import { Message, RoomUsersProfile } from "@/redux/slices/room/types";
import styles from "./chatMessages.module.css";
import { Loader } from "@/Components/Shared";
import ChatMessage from "./ChatMessage/ChatMessage";

interface Props {
  messages: Message[],
  usersProfile: RoomUsersProfile
}

function ChatMessages({ messages, usersProfile }: Props) {
  const hasRetrievedRoomsUsersProfile = Object.keys(usersProfile).length !== 0

  if (hasRetrievedRoomsUsersProfile == false) {
    return <Loader size="50%" />
  }

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
            message={message}
            user={usersProfile[message.userId]} />
        )
      })}
    </div>
  );
}

export default ChatMessages;