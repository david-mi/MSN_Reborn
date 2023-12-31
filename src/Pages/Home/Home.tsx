import useFriendRequest from "@/hooks/useFriendRequest";
import { Menu, FriendRequestAlert, Chat, MessagesNotifications } from "@/Components/Home";
import styles from "./home.module.css"
import { useAppSelector } from "@/redux/hooks";
import useRoomInvitation from "@/hooks/useRoomInvitation";
import RoomInvitationAlert from "@/Components/Home/RoomInvitationAlert/RoomInvitationAlert";
import useNotification from "@/hooks/useNotification";
import Notification from "@/Components/Shared/Notification/Notification";
import useWizz from "@/hooks/useWizz";

function Home() {
  const { usersWhoSentFriendRequest, haveFriendRequest } = useFriendRequest()
  const { havePendingRoomInvitation, pendingRoomsInvitation } = useRoomInvitation()
  const { haveNotifications, notifications } = useNotification()
  useWizz()
  const currentRoomId = useAppSelector(({ room }) => room.currentRoomId)
  const isChatDisplayed = currentRoomId !== null

  return (
    <div className={styles.home} data-testid="home">
      {haveFriendRequest && <FriendRequestAlert userWhoSentFriendRequest={usersWhoSentFriendRequest[0]} />}
      {havePendingRoomInvitation && <RoomInvitationAlert roomInvitation={pendingRoomsInvitation[0]} />}
      {haveNotifications && <Notification notification={notifications[0]} />}
      <Menu isChatDisplayed={isChatDisplayed} />
      {isChatDisplayed && <Chat />}
      <MessagesNotifications />
    </div>
  );
}

export default Home;