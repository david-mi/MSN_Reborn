import styles from "./heading.module.css";
import SendFriendRequest from "./SendFriendRequest/SendFriendRequest";

function Heading() {
  return (
    <div className={styles.heading}>
      <SendFriendRequest />
    </div>
  );
}

export default Heading;