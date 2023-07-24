import { useAppDispatch } from "@/redux/hooks";
import { disconnect } from "@/redux/slices/user/user";
import Profile from "@/Components/Home/Profile/Profile";
import { GradientLayout } from "@/Components/Shared";
import styles from "./home.module.css"

function Home() {
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch(disconnect())
  }

  return (
    <GradientLayout className={styles.home} data-testid="home">
      <Profile />
      <button onClick={handleClick}>Se déconnecter</button>
    </GradientLayout>
  );
}

export default Home;