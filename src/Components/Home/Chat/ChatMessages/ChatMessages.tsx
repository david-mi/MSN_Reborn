import { Message, RoomType } from "@/redux/slices/room/types";
import ChatMessage from "./ChatMessage/ChatMessage";
import { MutableRefObject, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./chatMessages.module.css";
import { UserProfile } from "@/redux/slices/user/types";
import useRoomMessagesPagination from "@/hooks/useRoomMessagesPagination";
import { setOldestRoomMessageDate } from "@/redux/slices/room/room";
import { Button, Loader } from "@/Components/Shared";

interface Props {
  messages: Message[],
  currentRoomUsersProfile: Map<string, UserProfile>
  roomId: string
  roomType: RoomType
  shouldScrollToBottomRef: MutableRefObject<boolean>
}

function ChatMessages(props: Props) {
  const dispatch = useAppDispatch()
  const { messages, currentRoomUsersProfile, roomId, roomType, shouldScrollToBottomRef } = props
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null!)
  const chatMessagesBottomRef = useRef<HTMLDivElement>(null!)
  const currentRoomOldestRetrievedMessageDate = useAppSelector(({ room }) => room.roomsList[roomId].oldestRetrievedMessageDate)
  const currentUser = useAppSelector(({ user }) => user)
  const { canPaginate, paginate, loadingPagination } = useRoomMessagesPagination(roomId, 5)
  const buttonRef = useRef<HTMLButtonElement>(null!)
  const containerRef = useRef<HTMLDivElement>(null!)

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
    if (messages[0] && messages[0].createdAt !== currentRoomOldestRetrievedMessageDate) {
      dispatch(setOldestRoomMessageDate({ roomId, date: messages[0].createdAt }))
    }

  }, [messages])

  // useEffect(() => {
  //   if (buttonRef.current !== null && loadingPagination === false) {
  //     const observer = new IntersectionObserver(([entry]) => {
  //       console.log(entry.isIntersecting)
  //       if (entry.isIntersecting === false) return
  //       shouldScrollToBottomRef.current = false
  //       paginate()
  //     }, { root: containerRef.current, threshold: 1 })

  //     observer.observe(buttonRef.current)

  //     return () => {
  //       console.log("return")
  //       observer.disconnect()
  //     }
  //   }
  // }, [roomId, loadingPagination])

  function handleClick() {
    shouldScrollToBottomRef.current = false
    paginate()
  }

  return (
    <div className={styles.chatMessagesContainer} ref={containerRef}>
      <div className={styles.paginationContainer}>
        {loadingPagination && <Loader size={"2rem"} />}
        {!loadingPagination && canPaginate && currentRoomOldestRetrievedMessageDate !== null && (
          <Button
            theme="gradient"
            title="Pagination"
            ref={buttonRef}
            onClick={handleClick}
            className={styles.pagination}
          />
        )}
      </div>
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
              user={currentRoomUsersProfile.get(message.userId) || currentUser}
              currentRoomUsersProfile={currentRoomUsersProfile}
            />
          )
        })}
        <div className={styles.messagesBottom} ref={chatMessagesBottomRef}></div>
      </div>
    </div>
  );
}

export default ChatMessages;