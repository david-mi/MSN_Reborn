import { useAppDispatch } from "@/redux/hooks";
import { disconnect } from "@/redux/slices/user/user";
import { Header, Profile } from ".";
import { GradientLayout } from "@/Components/Shared";
import styles from "./menu.module.css"

function Menu() {
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch(disconnect())
  }

  return (
    <GradientLayout className={styles.menu} data-testid="menu">
      <Header />
      <Profile />
      <button onClick={handleClick}>Se déconnecter</button>
    </GradientLayout>
  );
}

export default Menu;