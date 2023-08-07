import { Header, Profile, Contacts } from ".";
import { GradientLayout } from "@/Components/Shared";
import styles from "./menu.module.css"

interface Props {
  isChatDisplayed: boolean
}

function Menu({ isChatDisplayed }: Props) {
  const classNames = `${styles.menu} ${isChatDisplayed ? styles.closedInMobile : ""}`

  return (
    <GradientLayout className={classNames} data-testid="menu">
      <Header />
      <Profile />
      <Contacts />
    </GradientLayout>
  );
}

export default Menu;