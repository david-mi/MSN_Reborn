import { useCallback, useEffect, useState, MouseEvent, useRef } from "react";
import { Message, RoomType } from "@/redux/slices/room/types";
import { UserProfile } from "@/redux/slices/user/types";
import { Avatar } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { markRoomMessageAsRead } from "@/redux/slices/room/room";
import CheckMarkIcon from "./CheckMarkIcon/CheckMarkIcon";
import ReadByList from "./ReadByList/ReadByList";
import SystemMessage from "./SystemMessage/SystemMessage";
import styles from "./chatMessage.module.css";

interface Props {
  message: Message,
  roomId: string
  user: UserProfile
  displayAllInfos: boolean
  currentRoomUsersProfile: Map<string, UserProfile>
  roomType: RoomType
}

function ChatMessage(props: Props) {
  const { message, user, displayAllInfos, roomId, currentRoomUsersProfile, roomType } = props
  const { avatarSrc, username } = user;
  const { message: text, createdAt, readBy, userId } = message

  const currentUserId = useAppSelector(({ user }) => user.id)
  const dispatch = useAppDispatch()
  const [displayUsersWhoReadMessage, setDisplayUsersWhoReadMessage] = useState(false)
  const parseTimestamp = useCallback((createdAt: number, onlyHours: boolean) => {
    return new Date(createdAt).toLocaleString(undefined, {
      month: onlyHours ? undefined : "numeric",
      day: onlyHours ? undefined : "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }, [createdAt])
  const isMessageReadList = Object.entries(readBy)
  const readByCount = (isMessageReadList.filter(([_, isRead]) => isRead)).length
  const roomUsersCount = isMessageReadList.length
  const isMarkingAsRead = useRef(false)

  function toogleDisplayUsersWhoReadMessage(event: MouseEvent) {
    event.stopPropagation()
    setDisplayUsersWhoReadMessage((state) => !state)
  }

  useEffect(() => {
    const isMessageUnread = !message.readBy[currentUserId]

    if (isMessageUnread && isMarkingAsRead.current === false) {
      isMarkingAsRead.current = true
      dispatch(markRoomMessageAsRead({ roomId, messageId: message.id }))
    }
  }, [])

  if (user.id.startsWith("system")) {
    return <SystemMessage message={message} parseTimestamp={parseTimestamp} />
  }

  const chatText = roomType === "manyToMany"
    ? (
      <span
        className={styles.text}
        onMouseEnter={toogleDisplayUsersWhoReadMessage}
        onMouseLeave={toogleDisplayUsersWhoReadMessage}
      >
        <p>{text}</p>
        {displayUsersWhoReadMessage && (
          <ReadByList
            currentRoomUsersProfile={currentRoomUsersProfile}
            messageReadBy={readBy}
            messageUserId={userId}
            currentUserId={currentUserId}
          />
        )}
      </span>
    )
    : (
      <span className={styles.text}>
        <p>{text}</p>
        {
          readByCount === roomUsersCount &&
          userId === currentUserId && <CheckMarkIcon className={styles.read} />
        }
      </span>
    )

  return (
    displayAllInfos
      ? (
        <div className={styles.chatMessage}>
          <Avatar size="small" src={avatarSrc} />
          <p>{username}</p>
          {chatText}
          <p>{parseTimestamp(createdAt, false)}</p>
        </div>
      )
      : (
        <div className={styles.simpleChatMessage}>
          <p className={styles.date}>{parseTimestamp(createdAt, true)}</p>
          {chatText}
        </div>
      )
  );
}

export default ChatMessage;