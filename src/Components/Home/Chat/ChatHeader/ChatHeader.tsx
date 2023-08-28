import chatLogo from "./chat-logo.png"
import { ImageLoadWrapper } from "@/Components/Shared";
import { CloseButton } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setcurrentDisplayedRoom } from "@/redux/slices/room/room";
import styles from "./chatHeader.module.css";
import { RoomType } from "@/redux/slices/room/types";
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";

interface Props {
  roomType: RoomType
  users: string[]
}

function ChatHeader({ roomType, users }: Props) {
  const dispatch = useAppDispatch()
  const contactsProfile = useAppSelector(({ contact }) => contact.contactsProfile)
  const currentUser = useAppSelector(({ user }) => user)

  function closeChat() {
    dispatch(setcurrentDisplayedRoom(null))
  }

  let headerInfos: JSX.Element

  if (roomType === "oneToOne") {
    const targetUser = contactsProfile[users.filter((userId) => userId !== currentUser.id)[0]]
    const { displayedStatus, personalMessage, email, username } = targetUser
    const targetUserStatus = statusesObject[displayedStatus]

    headerInfos = (
      <div className={styles.singleInfos}>
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
      <div className={styles.multiInfos}>
        INCOMING
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