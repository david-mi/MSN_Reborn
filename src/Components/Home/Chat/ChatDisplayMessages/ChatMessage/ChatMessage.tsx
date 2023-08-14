import { Message } from "@/redux/slices/room/types";
import styles from "./chatMessage.module.css";
import { UserProfile } from "@/redux/slices/user/types";
import { Avatar } from "@/Components/Shared";
import { useCallback } from "react";

interface Props {
  message: Message,
  user: UserProfile
  displayAllInfos: boolean
}

function ChatMessage({ message, user, displayAllInfos }: Props) {
  const { avatarSrc, personalMessage, username } = user;
  const { message: text, createdAt } = message

  const parseTimestamp = useCallback((createdAt: number, onlyHours: boolean) => {
    return new Date(createdAt).toLocaleString(undefined, {
      month: onlyHours ? undefined : "numeric",
      day: onlyHours ? undefined : "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }, [createdAt])

  return (
    displayAllInfos
      ? (
        <div className={styles.chatMessage}>
          <Avatar size="mini" src={avatarSrc} />
          <p>{username}</p>
          <p>{personalMessage !== "" ? `(${personalMessage})` : ""}</p>
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