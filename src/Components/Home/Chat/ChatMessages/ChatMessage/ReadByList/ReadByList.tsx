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
  currentUserId: string
}

function ReadByList({ currentRoomUsersProfile, messageReadBy, messageUserId, currentUserId }: Props) {
  return (
    <ul className={styles.readByList}>
      {Array.from(currentRoomUsersProfile.values()).map(({ avatarSrc, username, id }) => {
        const displayUser = (
          messageReadBy[id] &&
          id !== messageUserId &&
          id !== currentUserId
        )

        return displayUser
          ? (
            <li key={id}>
              <Avatar src={avatarSrc} size="micro" />
              <p>{username}</p>
              <CheckMarkIcon />
            </li>
          )
          : null
      })}
    </ul>
  );
}

export default ReadByList;