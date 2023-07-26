import Menu from "@/Components/Home/Menu/Menu";
import styles from "./home.module.css"
import FriendRequestAlert from "@/Components/Home/FriendRequestAlert/FriendRequestAlert";

function Home() {
  return (
    <div className={styles.home} data-testid="home">
      {false && <FriendRequestAlert />}
      <Menu />
    </div>
  );
}

export default Home;