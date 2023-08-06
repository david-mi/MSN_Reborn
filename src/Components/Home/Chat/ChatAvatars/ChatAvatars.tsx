import { useState } from "react"
import { Avatar } from "@/Components/Shared";
import DisplayAvatarsButton from "./DisplayAvatarsButton/DisplayAvatarsButton";
import styles from "./chatAvatars.module.css";

function ChatAvatars() {
  const [displayAvatars, setDisplayAvatars] = useState(true)

  return (
    <div className={styles.chatAvatars}>
      {displayAvatars && (
        <div className={styles.avatars}>
          <div className={styles.avatarContainer}>
            <Avatar size="medium" />
          </div>
          <div className={styles.avatarContainer}>
            <Avatar size="medium" />
          </div>
        </div>
      )}
      <DisplayAvatarsButton setDisplayAvatars={setDisplayAvatars} />
    </div>
  );
}

export default ChatAvatars;