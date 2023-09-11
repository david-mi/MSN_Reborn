import { Avatar, ImageLoadWrapper } from "@/Components/Shared";
import type { UserProfile } from "@/redux/slices/user/types";
import styles from "./chatUsersPanel.module.css";
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";
import { RoomUsers } from "@/redux/slices/room/types";

interface Props {
  currentRoomUsersProfile: Map<string, UserProfile>
  users: RoomUsers
}

function ChatUsersPanel({ currentRoomUsersProfile, users }: Props) {

  return (
    <div className={styles.chatUsersPanel}>
      <ul className={styles.container}>
        {Array
          .from(currentRoomUsersProfile.values())
          .filter((userProfile) => users[userProfile.id])
          .map(({ id, avatarSrc, username, personalMessage, displayedStatus }) => {
            return (
              <li className={styles.displayedContact} key={id}>
                <div className={styles.avatarContainer}>
                  <Avatar src={avatarSrc} size="mini" />
                  <ImageLoadWrapper
                    imageProps={{ src: statusesObject[displayedStatus].icon, alt: "icône du status de l'utilisateur" }}
                    loaderOptions={{ size: "16px", thickness: "2px" }}
                  />
                </div>
                <span>{username}</span>
                <small> {personalMessage}</small>
              </li >
            )
          })}
      </ul>
    </div>
  );
}

export default ChatUsersPanel;