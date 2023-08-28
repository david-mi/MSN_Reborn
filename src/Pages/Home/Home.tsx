import useFriendRequest from "@/hooks/useFriendRequest";
import { Menu, FriendRequestAlert, Chat } from "@/Components/Home";
import styles from "./home.module.css"
import { useAppSelector } from "@/redux/hooks";
import useRoomInvitation from "@/hooks/useRoomInvitation";
import RoomInvitationAlert from "@/Components/Home/RoomInvitationAlert/RoomInvitationAlert";

function Home() {
  const { usersWhoSentFriendRequest, haveFriendRequest } = useFriendRequest()
  const { havePendingRoomInvitation, pendingRoomsInvitation } = useRoomInvitation()
  const currentRoom = useAppSelector(({ room }) => room.currentRoomId)
  const isChatDisplayed = currentRoom !== null

  return (
    <div className={styles.home} data-testid="home">
      {haveFriendRequest && <FriendRequestAlert userWhoSentFriendRequest={usersWhoSentFriendRequest[0]} />}
      {havePendingRoomInvitation && <RoomInvitationAlert roomInfos={pendingRoomsInvitation[0]} />}
      <Menu isChatDisplayed={isChatDisplayed} />
      {isChatDisplayed && <Chat />}
    </div>
  );
}

export default Home;