import Menu from "@/Components/Home/Menu/Menu";
import styles from "./home.module.css"
import FriendRequestAlert from "@/Components/Home/FriendRequestAlert/FriendRequestAlert";
import useFriendRequest from "@/hooks/useFriendRequest";

function Home() {
  const { friendRequestingUsers, hasFriendRequests } = useFriendRequest()

  return (
    <div className={styles.home} data-testid="home">
      {hasFriendRequests && <FriendRequestAlert friendRequestingUser={friendRequestingUsers[0]} />}
      <Menu />
    </div>
  );
}

export default Home;