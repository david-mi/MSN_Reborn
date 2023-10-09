import { ToastContentProps } from "node_modules/react-toastify/dist/types";
import styles from "./messageNotification.module.css";
import { NotificationMessage } from "@/redux/slices/room/types";
import { Avatar } from "@/Components/Shared";
import { systemIcons } from "../../Chat/ChatMessages/ChatMessage/SystemMessage/systemIcons/systemIcons";

interface Props {
  messageToNotify: NotificationMessage
}

function MessageNotification({ messageToNotify }: Partial<ToastContentProps> & Props) {
  const { roomOrContactName, message, roomOrContactAvatarSrc, userId } = messageToNotify

  return (
    <div className={styles.messageNotification}>
      <Avatar
        size={"small"}
        src={roomOrContactAvatarSrc}
        className={styles.avatar}
      />
      <p className={styles.name}>{roomOrContactName}</p>
      <div className={styles.message}>
        {userId.startsWith("system")
          ? message.split(/(?<=:)\s/g).map((text) => text in systemIcons
            ? <p key={text} className={styles.icon}>{systemIcons[text as keyof typeof systemIcons]}</p>
            : <small key={text} className={styles.text}>Alerte Wizz</small>
          )
          : message
        }
      </div>
    </div>
  );
}

export default MessageNotification;