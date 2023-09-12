import chatLogo from "./chat-logo.png"
import { ImageLoadWrapper, CloseButton } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setcurrentDisplayedRoom } from "@/redux/slices/room/room";
import styles from "./chatHeader.module.css";
import { Room } from "@/redux/slices/room/types";
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";
import { UserProfile } from "@/redux/slices/user/types";

interface Props {
  room: Room
  currentRoomUsersProfile: Map<string, UserProfile>
}

function ChatHeader({ room, currentRoomUsersProfile }: Props) {
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector(({ user }) => user.id)

  function closeChat() {
    dispatch(setcurrentDisplayedRoom(null))
  }

  let headerInfos: JSX.Element

  if (room.type === "oneToOne") {
    const targetUser = (Array
      .from(currentRoomUsersProfile.values())
      .filter((userProfile) => userProfile.id !== currentUserId))[0]
    const { displayedStatus, personalMessage, email, username } = targetUser
    const targetUserStatus = statusesObject[displayedStatus]

    headerInfos = (
      <div className={styles.oneToOne}>
        <p className={styles.pseudo}>{username}</p>
        <div className={styles.status}>
          (<p>{targetUserStatus.sentence}</p>
          <ImageLoadWrapper
            imageProps={{ src: targetUserStatus.icon, alt: "icône du status de l'utilisateur" }}
            loaderOptions={{ size: "16px", thickness: "2px" }}
          />)
        </div>
        <p className={styles.personalSentence}>
          {personalMessage === ""
            ? email
            : personalMessage
          }
        </p>
      </div>
    )
  } else {
    headerInfos = (
      <div className={styles.manyToMany}>
        <p className={styles.name}>{room.name}</p>
      </div>
    )
  }

  return (
    <header className={styles.chatHeader}>
      <ImageLoadWrapper imageProps={{ src: chatLogo, className: styles.image }} />
      {headerInfos}
      <CloseButton
        type="button"
        onClick={closeChat}
        className={styles.closeButton}
      />
    </header>
  );
}

export default ChatHeader;