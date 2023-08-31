import { useCallback, useEffect, useState, MouseEvent } from "react";
import { Message, RoomType } from "@/redux/slices/room/types";
import { UserProfile } from "@/redux/slices/user/types";
import { Avatar } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { markRoomMessageAsRead } from "@/redux/slices/room/room";
import CheckMarkIcon from "./CheckMarkIcon/CheckMarkIcon";
import styles from "./chatMessage.module.css";

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

  function toogleDisplayUsersWhoReadMessage(event: MouseEvent) {
    event.stopPropagation()
    setDisplayUsersWhoReadMessage((state) => !state)
  }

  useEffect(() => {
    const isMessageUnread = !message.readBy[currentUserId]

    if (isMessageUnread) {
      const markRoomMessageAsReadDispatch = dispatch(markRoomMessageAsRead({ roomId, messageId: message.id }))
      return markRoomMessageAsReadDispatch.abort
    }
  }, [dispatch])

  let readByCheckMark: JSX.Element | null = null
  const isMessageReadList = Object.entries(readBy)

  if (isMessageReadList.filter(([_, isRead]) => isRead).length === isMessageReadList.length) {
    readByCheckMark = <CheckMarkIcon className={`${styles.icon} ${styles.read}`} />
  }

  let readByUserList: JSX.Element | null = null

  if (roomType === "manyToMany") {
    readByUserList = (
      <ul className={styles.readByList}>
        {currentRoomUsersProfileList.map(({ avatarSrc, username, id }) => {
          return (
            <li key={id}>
              <Avatar src={avatarSrc} size="micro" />
              <p>{username}</p>
              {readBy[id]
                ? <CheckMarkIcon className={styles.icon} />
                : null
              }
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    displayAllInfos
      ? (
        <div className={styles.chatMessage}>
          <Avatar size="mini" src={avatarSrc} />
          <p>{username}</p>
          <span className={styles.text} onMouseEnter={toogleDisplayUsersWhoReadMessage} onMouseLeave={toogleDisplayUsersWhoReadMessage}>
            <p>{text}</p>
            {readByCheckMark}
            {displayUsersWhoReadMessage && readByUserList}
          </span>
          <small>{parseTimestamp(createdAt, false)}</small>
        </div>
      )
      : (
        <div className={styles.simpleChatMessage}>
          <small className={styles.date}>{parseTimestamp(createdAt, true)}</small>
          <span className={styles.text} onMouseEnter={toogleDisplayUsersWhoReadMessage} onMouseLeave={toogleDisplayUsersWhoReadMessage}>
            <p>{text}</p>
            {readByCheckMark}
            {displayUsersWhoReadMessage && readByUserList}
          </span>
        </div>
      )
  );
}

export default ChatMessage;