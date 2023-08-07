import { Button } from "@/Components/Shared";
import styles from "./chatSendMessage.module.css";

function ChatSendMessage() {

  function sendMessage() {
    console.log("message sent")
  }

  return (
    <div className={styles.chatSendMessage}>
      <textarea id="sendMessage"></textarea>
      <Button
        className={styles.submitButton}
        theme="gradient"
        title="Envoyer"
        onClick={sendMessage}
      />
    </div>
  );
}

export default ChatSendMessage;