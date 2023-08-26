import type { RoomType } from "@/redux/slices/room/types";
import ButtonWithImage from "@/Components/Shared/ButtonWithImage/ButtonWithImage";
import addUserToChatIcon from "./chat-add-user.png"
import styles from "./chatOptions.module.css";

interface Props {
  roomType: RoomType
}

function ChatOptions({ roomType }: Props) {
  let optionsContent: JSX.Element

  if (roomType === "oneToOne") {
    const handleCreateRoomAndAddUsersToIt = () => console.log("send request then create room")

    optionsContent = (
      <ButtonWithImage
        onClick={handleCreateRoomAndAddUsersToIt}
        src={addUserToChatIcon}
        className={styles.addContactButton}
      />
    )
  } else {
    const handleAddContactToRoomClick = () => console.log("send request then create room")

    optionsContent = (
      <ButtonWithImage
        onClick={handleAddContactToRoomClick}
        src={addUserToChatIcon}
        className={styles.addContactButton}
      />
    )
  }

  return (
    <div className={styles.chatOptions}>
      {optionsContent}
    </div>
  );
}

export default ChatOptions;