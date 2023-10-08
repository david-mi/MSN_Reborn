import { ToastContentProps } from "node_modules/react-toastify/dist/types";
import styles from "./messageNotification.module.css";
import { NotificationMessage } from "@/redux/slices/room/types";
import { Avatar } from "@/Components/Shared";

interface Props {
  messageToNotify: NotificationMessage
}

function MessageNotification({ messageToNotify }: Partial<ToastContentProps> & Props) {
  const { roomOrContactName, message, roomOrContactAvatarSrc } = messageToNotify

  return (
    <div className={styles.messageNotification}>
      <Avatar
        size={"small"}
        src={roomOrContactAvatarSrc}
        className={styles.avatar}
      />
      <p className={styles.name}>{roomOrContactName}</p>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default MessageNotification;