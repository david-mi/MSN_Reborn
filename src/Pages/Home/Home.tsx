import useFriendRequest from "@/hooks/useFriendRequest";
import { Menu, FriendRequestAlert, Chat } from "@/Components/Home";
import styles from "./home.module.css"

function Home() {
  const { usersWhoSentFriendRequest, haveFriendRequest } = useFriendRequest()

  return (
    <div className={styles.home} data-testid="home">
      {haveFriendRequest && <FriendRequestAlert userWhoSentFriendRequest={usersWhoSentFriendRequest[0]} />}
      <Menu />
      <Chat />
    </div>
  );
}

export default Home;