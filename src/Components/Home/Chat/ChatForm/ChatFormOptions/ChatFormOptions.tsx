import SendWizzButton from "./SendWizzButton/SendWizzButton";
import styles from "./chatFormOptions.module.css";

interface Props {
  roomId: string
}

function ChatFormOptions({ roomId }: Props) {
  return (
    <div className={styles.chatFormOptions}>
      <SendWizzButton roomId={roomId} />
    </div>
  );
}

export default ChatFormOptions;