import { useAppDispatch } from "@/redux/hooks";
import { disconnect } from "@/redux/slices/user/user";
import Profile from "@/Components/Home/Profile/Profile";
import { GradientLayout } from "@/Components/Shared";
import styles from "./home.module.css"
import Header from "@/Components/Home/Header/Header";

function Home() {
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch(disconnect())
  }

  return (
    <GradientLayout className={styles.home} data-testid="home">
      <Header />
      <Profile />
      <button onClick={handleClick}>Se déconnecter</button>
    </GradientLayout>
  );
}

export default Home;