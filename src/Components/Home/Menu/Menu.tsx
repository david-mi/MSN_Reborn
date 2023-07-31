import { Header, Profile, Contacts } from ".";
import { GradientLayout } from "@/Components/Shared";
import styles from "./menu.module.css"

function Menu() {
  return (
    <GradientLayout className={styles.menu} data-testid="menu">
      <Header />
      <Profile />
      <Contacts />

    </GradientLayout>
  );
}

export default Menu;