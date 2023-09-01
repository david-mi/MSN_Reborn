import { Avatar } from "@/Components/Shared";
import CheckMarkIcon from "../CheckMarkIcon/CheckMarkIcon";
import styles from "./readByList.module.css";
import { UserProfile } from "@/redux/slices/user/types";

interface Props {
  currentRoomUsersProfileList: UserProfile[],
  messageReadBy: {
    [userId: string]: boolean
  }
}

function ReadByList({ currentRoomUsersProfileList, messageReadBy }: Props) {
  return (
    <ul className={styles.readByList}>
      {currentRoomUsersProfileList.map(({ avatarSrc, username, id }) => {
        return (
          <li key={id}>
            <Avatar src={avatarSrc} size="micro" />
            <p>{username}</p>
            {messageReadBy[id]
              ? <CheckMarkIcon />
              : null
            }
          </li>
        )
      })}
    </ul>
  );
}

export default ReadByList;