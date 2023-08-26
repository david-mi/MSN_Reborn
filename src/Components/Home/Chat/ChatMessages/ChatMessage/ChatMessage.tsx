import { useCallback, useEffect } from "react";
import { Message } from "@/redux/slices/room/types";
import styles from "./chatMessage.module.css";
import { UserProfile } from "@/redux/slices/user/types";
import { Avatar } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { markRoomMessageAsRead } from "@/redux/slices/room/room";

interface Props {
  message: Message,
  roomId: string
  user: UserProfile
  displayAllInfos: boolean
}

function ChatMessage({ message, user, displayAllInfos, roomId }: Props) {
  const { avatarSrc, username } = user;
  const { message: text, createdAt } = message

  const currentUserId = useAppSelector(({ user }) => user.id)
  const dispatch = useAppDispatch()
  const parseTimestamp = useCallback((createdAt: number, onlyHours: boolean) => {
    return new Date(createdAt).toLocaleString(undefined, {
      month: onlyHours ? undefined : "numeric",
      day: onlyHours ? undefined : "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }, [createdAt])

  useEffect(() => {
    const isMessageUnread = !message.readBy[currentUserId]

    if (isMessageUnread) {
      const markRoomMessageAsReadDispatch = dispatch(markRoomMessageAsRead({ roomId, messageId: message.id }))
      return markRoomMessageAsReadDispatch.abort
    }
  }, [dispatch])

  return (
    displayAllInfos
      ? (
        <div className={styles.chatMessage}>
          <Avatar size="mini" src={avatarSrc} />
          <p>{username}</p>
          <p>{text}</p>
          <small>{parseTimestamp(createdAt, false)}</small>
        </div>
      )
      : (
        <div className={styles.simpleChatMessage}>
          <small className={styles.date}>{parseTimestamp(createdAt, true)}</small>
          <p>{text}</p>
        </div>
      )
  );
}

export default ChatMessage;