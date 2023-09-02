import { useCallback, useEffect, useState, MouseEvent } from "react";
import { Message, RoomType } from "@/redux/slices/room/types";
import { UserProfile } from "@/redux/slices/user/types";
import { Avatar } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { markRoomMessageAsRead } from "@/redux/slices/room/room";
import CheckMarkIcon from "./CheckMarkIcon/CheckMarkIcon";
import styles from "./chatMessage.module.css";
import ReadByList from "./ReadByList/ReadByList";

interface Props {
  message: Message,
  roomId: string
  user: UserProfile
  displayAllInfos: boolean
  currentRoomUsersProfileList: UserProfile[]
  roomType: RoomType
}

function ChatMessage(props: Props) {
  const { message, user, displayAllInfos, roomId, currentRoomUsersProfileList, roomType } = props
  const { avatarSrc, username } = user;
  const { message: text, createdAt, readBy } = message

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

  function toogleDisplayUsersWhoReadMessage(event: MouseEvent) {
    event.stopPropagation()
    if (readByCount <= 1) return
    setDisplayUsersWhoReadMessage((state) => !state)
  }

  useEffect(() => {
    const isMessageUnread = !message.readBy[currentUserId]

    if (isMessageUnread) {
      const markRoomMessageAsReadDispatch = dispatch(markRoomMessageAsRead({ roomId, messageId: message.id }))
      return markRoomMessageAsReadDispatch.abort
    }
  }, [dispatch])

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
            currentRoomUsersProfileList={currentRoomUsersProfileList}
            messageReadBy={readBy}
          />
        )}
      </span>
    )
    : (
      <span className={styles.text}>
        <p>{text}</p>
        {readByCount === roomUsersCount && <CheckMarkIcon className={styles.read} />}
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