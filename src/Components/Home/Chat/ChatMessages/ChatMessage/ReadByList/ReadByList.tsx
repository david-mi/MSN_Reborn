import { Avatar } from "@/Components/Shared";
import CheckMarkIcon from "../CheckMarkIcon/CheckMarkIcon";
import styles from "./readByList.module.css";
import { UserProfile } from "@/redux/slices/user/types";

interface Props {
  currentRoomUsersProfile: Map<string, UserProfile>
  messageReadBy: {
    [userId: string]: boolean
  }
  messageUserId: string
}

function ReadByList({ currentRoomUsersProfile, messageReadBy, messageUserId }: Props) {
  return (
    <ul className={styles.readByList}>
      {Array.from(currentRoomUsersProfile.values()).map(({ avatarSrc, username, id }) => {
        return (
          messageReadBy[id] && id !== messageUserId
            ? (
              <li key={id}>
                <Avatar src={avatarSrc} size="micro" />
                <p>{username}</p>
                <CheckMarkIcon />
              </li>
            )
            : null
        )
      })}
    </ul>
  );
}

export default ReadByList;