import { Avatar } from "@/Components/Shared";
import { UserProfile } from "@/redux/slices/user/types";
import styles from "./roomUsersProfile.module.css";

interface Props {
  roomUsersProfile: UserProfile[]
}

function RoomUsersProfile({ roomUsersProfile }: Props) {
  return (
    <div className={styles.roomUsersProfile}>
      {roomUsersProfile.map(({ avatarSrc, username, email, id }) => {
        return (
          <div key={id} className={styles.roomUserProfile}>
            <Avatar src={avatarSrc} size="mini" />
            <p>{username}</p>
            <small>{`<${email}>`}</small>
          </div>
        )
      })}
    </div>
  );
}

export default RoomUsersProfile;