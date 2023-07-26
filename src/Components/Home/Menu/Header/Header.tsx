import styles from "./header.module.css";
import windowsLogo from "./windows-logo.png"

function Header() {
  return (
    <header className={styles.header}>
      <img src={windowsLogo} alt="Logo windows" />
      <h1 className={styles.title}>MSN <b>Reborn</b></h1>
    </header>
  );
}

export default Header;