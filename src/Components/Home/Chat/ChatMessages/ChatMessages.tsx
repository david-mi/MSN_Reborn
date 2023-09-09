import { Message, RoomType } from "@/redux/slices/room/types";
import ChatMessage from "./ChatMessage/ChatMessage";
import { MutableRefObject, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./chatMessages.module.css";
import { UserProfile } from "@/redux/slices/user/types";
import useRoomMessagesPagination from "@/hooks/useRoomMessagesPagination";
import { setOldestRoomMessageDate, setPreviousScrollTop } from "@/redux/slices/room/room";
import { Loader } from "@/Components/Shared";

interface Props {
  messages: Message[],
  currentRoomUsersProfile: Map<string, UserProfile>
  roomId: string
  roomType: RoomType
  shouldScrollToBottomRef: MutableRefObject<boolean>
  previousMessagesScrollTop: number | null
}

function ChatMessages(props: Props) {
  const dispatch = useAppDispatch()
  const { messages, currentRoomUsersProfile, roomId, roomType, shouldScrollToBottomRef, previousMessagesScrollTop } = props
  const chatMessagesBottomRef = useRef<HTMLDivElement>(null!)
  const currentRoomOldestRetrievedMessageDate = useAppSelector(({ room }) => room.roomsList[roomId].oldestRetrievedMessageDate)
  const currentUser = useAppSelector(({ user }) => user)
  const { canPaginate, paginate, retrievingPreviousMessages } = useRoomMessagesPagination(roomId, 5)
  const loaderRef = useRef<HTMLDivElement>(null!)
  const containerRef = useRef<HTMLDivElement>(null!)
  const containerRefScrollTopRef = useRef<null | number>(null)
  const displayLoader = !retrievingPreviousMessages && canPaginate && currentRoomOldestRetrievedMessageDate !== null
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
    const { clientHeight, scrollHeight, scrollTop } = containerRef!.current
    const hasReachedBottom = clientHeight + Math.ceil(scrollTop) === scrollHeight
    containerRefScrollTopRef.current = scrollTop

    shouldScrollToBottomRef.current = hasReachedBottom
  }

  useEffect(() => {
    if (shouldScrollToBottomRef.current === true) {
      chatMessagesBottomRef.current!.scrollIntoView({ behavior: "smooth" });
    } else {
      containerRef!.current.scrollTop = 50
    }

    if (messages[0] && messages[0].createdAt !== currentRoomOldestRetrievedMessageDate) {
      dispatch(setOldestRoomMessageDate({ roomId, date: messages[0].createdAt }))
    }
  }, [messages])

  useEffect(() => {
    if (displayLoader === false) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === false) return
      shouldScrollToBottomRef.current = false
      paginate()
    }, { root: containerRef.current, threshold: 0.9 })

    observer.observe(loaderRef.current)

    return () => {
      observer.disconnect()
    }
  }, [roomId, displayLoader])

  useEffect(() => {
    if (previousMessagesScrollTop !== null) {
      containerRef!.current.scrollTop = previousMessagesScrollTop
    }

    return () => {
      dispatch(setPreviousScrollTop({
        roomId,
        scrollTop: containerRefScrollTopRef.current
      }))
    }
  }, [roomId])

  return (
    <div className={styles.chatMessagesContainer} ref={containerRef} onScroll={handleScroll}>
      <div className={styles.paginationContainer}>
        {displayLoader && (
          <Loader
            size={"2rem"}
            ref={loaderRef}
            className={styles.pagination}
          />
        )}
      </div>
      <div className={styles.chatMessages}>
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