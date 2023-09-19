import { Message } from "@/redux/slices/room/types";
import { systemIcons } from "./systemIcons/systemIcons";
import styles from "./systemMessage.module.css";

interface Props {
  message: Message
  parseTimestamp: (createdAt: number, onlyHours: boolean) => string
}

function SystemMessage({ message, parseTimestamp }: Props) {
  const { message: text, createdAt } = message

  return (
    <div className={styles.systemMessage}>
      {text.split(/(?<=:)\s/g).map((text) => text in systemIcons
        ? <p key={text} className={styles.icon}>{systemIcons[text as keyof typeof systemIcons]}</p>
        : <small key={text} className={styles.text}>{text}</small>
      )}
      <p className={styles.date}>{parseTimestamp(createdAt, false)}</p>
    </div>
  );
}

export default SystemMessage;