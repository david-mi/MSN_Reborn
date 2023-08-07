import useFriendRequest from "@/hooks/useFriendRequest";
import { Menu, FriendRequestAlert, Chat } from "@/Components/Home";
import styles from "./home.module.css"
import { useAppSelector } from "@/redux/hooks";

function Home() {
  const { usersWhoSentFriendRequest, haveFriendRequest } = useFriendRequest()
  const currentDisplayedRoom = useAppSelector(({ chat }) => chat.currentDisplayedRoom)
  const isChatDisplayed = currentDisplayedRoom !== null

  return (
    <div className={styles.home} data-testid="home">
      {haveFriendRequest && <FriendRequestAlert userWhoSentFriendRequest={usersWhoSentFriendRequest[0]} />}
      <Menu isChatDisplayed={isChatDisplayed} />
      {isChatDisplayed && <Chat />}
    </div>
  );
}

export default Home;