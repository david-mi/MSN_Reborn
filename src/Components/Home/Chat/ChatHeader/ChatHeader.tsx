import chatLogo from "./chat-logo.png"
import { ImageLoadWrapper } from "@/Components/Shared";
import styles from "./chatHeader.module.css";

function ChatHeader() {
  return (
    <div className={styles.chatHeader}>
      <ImageLoadWrapper imageProps={{ src: chatLogo, className: styles.image }} />
      <p className={styles.pseudo}>Pseudo</p>
      <p className={styles.status}>(Status)</p>
      <p className={styles.description}>(description)</p>
    </div>
  );
}

export default ChatHeader;