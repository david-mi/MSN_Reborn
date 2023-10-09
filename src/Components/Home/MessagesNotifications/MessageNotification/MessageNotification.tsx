import { ToastContentProps } from "node_modules/react-toastify/dist/types";
import styles from "./messageNotification.module.css";
import { NotificationMessage } from "@/redux/slices/room/types";
import { Avatar } from "@/Components/Shared";
import { systemIcons } from "../../Chat/ChatMessages/ChatMessage/SystemMessage/systemIcons/systemIcons";

interface Props {
  messageToNotify: NotificationMessage
}

function MessageNotification({ messageToNotify }: Partial<ToastContentProps> & Props) {
  const { roomOrContactName, message, roomOrContactAvatarSrc, userId, roomType, username } = messageToNotify

  return (
    <div className={styles.messageNotification}>
      <Avatar
        size={"small"}
        src={roomOrContactAvatarSrc}
        className={styles.avatar}
      />
      <p className={styles.name}>{roomOrContactName}</p>
      {roomType === "manyToMany" && userId.startsWith("system") === false && <small className={styles.username}>{username} : </small>}
      <div className={styles.message}>
        {userId.startsWith("system")
          ? message.split(/(?<=:)\s/g).map((text) => text in systemIcons
            ? <span key={text} className={styles.icon}>{systemIcons[text as keyof typeof systemIcons]}</span>
            : <small key={text} className={styles.text}>{text}</small>
          )
          : <p className={styles.text}>{message}</p>
        }
      </div>
    </div>
  );
}

export default MessageNotification;