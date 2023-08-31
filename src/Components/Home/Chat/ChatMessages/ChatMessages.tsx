import { Message, RoomType, RoomUsersProfile } from "@/redux/slices/room/types";
import ChatMessage from "./ChatMessage/ChatMessage";
import { MutableRefObject, useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import styles from "./chatMessages.module.css";
import { UserProfile } from "@/redux/slices/user/types";

interface Props {
  messages: Message[],
  currentRoomUsersProfile: RoomUsersProfile
  roomId: string
  roomType: RoomType
  shouldScrollToBottomRef: MutableRefObject<boolean>
  currentRoomUsersProfileList: UserProfile[]
}

function ChatMessages(props: Props) {
  const { messages, currentRoomUsersProfile, roomId, roomType, shouldScrollToBottomRef, currentRoomUsersProfileList } = props
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
            roomType={roomType}
            message={message}
            user={currentRoomUsersProfile[message.userId] || currentUser}
            currentRoomUsersProfileList={currentRoomUsersProfileList}
          />
        )
      })}
      <div ref={chatMessagesBottomRef}></div>
    </div>
  );
}

export default ChatMessages;