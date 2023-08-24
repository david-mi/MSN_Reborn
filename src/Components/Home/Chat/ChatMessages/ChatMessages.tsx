import { Message, RoomUsersProfile } from "@/redux/slices/room/types";
import styles from "./chatMessages.module.css";
import ChatMessage from "./ChatMessage/ChatMessage";
import { MutableRefObject, useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";

interface Props {
  messages: Message[],
  usersProfile: RoomUsersProfile
  roomId: string
  shouldScrollToBottomRef: MutableRefObject<boolean>
}

function ChatMessages({ messages, usersProfile, roomId, shouldScrollToBottomRef }: Props) {
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null!)
  const chatMessagesBottomRef = useRef<HTMLDivElement>(null!)
  const currentUser = useAppSelector(({ user }) => user)

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

  function handleScroll() {
    const { clientHeight, scrollHeight, scrollTop } = chatMessagesContainerRef!.current
    const hasReachedBottom = clientHeight + Math.ceil(scrollTop) === scrollHeight

    shouldScrollToBottomRef.current = hasReachedBottom
  }

  useEffect(() => {
    if (shouldScrollToBottomRef.current === true) {
      chatMessagesBottomRef.current!.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])

  return (
    <div
      onScroll={handleScroll}
      ref={chatMessagesContainerRef}
      className={styles.chatMessages}
    >
      {messages.map((message, index) => {
        return (
          <ChatMessage
            displayAllInfos={shouldDisplayAllMessageInfos(index, message)}
            key={message.id}
            roomId={roomId}
            message={message}
            user={usersProfile[message.userId] || currentUser}
          />
        )
      })}
      <div ref={chatMessagesBottomRef}></div>
    </div>
  );
}

export default ChatMessages;