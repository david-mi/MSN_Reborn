import chatLogo from "./chat-logo.png"
import { ImageLoadWrapper } from "@/Components/Shared";
import { CloseButton } from "@/Components/Shared";
import { useAppDispatch } from "@/redux/hooks";
import { setcurrentDisplayedRoom } from "@/redux/slices/chat/chat";
import styles from "./chatHeader.module.css";

function ChatHeader() {
  const dispatch = useAppDispatch()

  function closeChat() {
    dispatch(setcurrentDisplayedRoom(null))
  }

  return (
    <header className={styles.chatHeader}>
      <ImageLoadWrapper imageProps={{ src: chatLogo, className: styles.image }} />
      <p className={styles.pseudo}>Pseudo</p>
      <p className={styles.status}>(Status)</p>
      <p className={styles.description}>(description)</p>
      <CloseButton
        type="button"
        onClick={closeChat}
        className={styles.closeButton}
      />
    </header>
  );
}

export default ChatHeader;