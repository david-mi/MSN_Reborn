import { Avatar } from "@/Components/Shared";
import CheckMarkIcon from "../CheckMarkIcon/CheckMarkIcon";
import styles from "./readByList.module.css";
import { UserProfile } from "@/redux/slices/user/types";

interface Props {
  currentRoomUsersProfileList: UserProfile[],
  messageReadBy: {
    [userId: string]: boolean
  }
  messageUserId: string
}

function ReadByList({ currentRoomUsersProfileList, messageReadBy, messageUserId }: Props) {
  return (
    <ul className={styles.readByList}>
      {currentRoomUsersProfileList.map(({ avatarSrc, username, id }) => {
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