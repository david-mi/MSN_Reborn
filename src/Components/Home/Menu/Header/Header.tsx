import DisconnectButton from "./DisconnectButton/DisconnectButton";
import windowsLogo from "./windows-logo.png"
import styles from "./header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <img src={windowsLogo} alt="Logo windows" />
      <h1 className={styles.title}>MSN <b>Reborn</b></h1>
      <DisconnectButton />
    </header>
  );
}

export default Header;