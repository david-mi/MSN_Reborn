import { ButtonWithSvg } from "@/Components/Shared";
import windowsLogo from "./windows-logo.png"
import { useAppDispatch } from "@/redux/hooks";
import { disconnect } from "@/redux/slices/user/user";
import styles from "./header.module.css";
import useOptions from "@/hooks/useOptions";

function Header() {
  useOptions()
  const dispatch = useAppDispatch()

  function handleDisconnect() {
    dispatch(disconnect())
  }

  return (
    <header className={styles.header}>
      <img src={windowsLogo} alt="Logo windows" />
      <h1 className={styles.title}>MSN <b>Reborn</b></h1>
      <ButtonWithSvg className={styles.disconnectButton} onClick={handleDisconnect}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 16 17"><path fillRule="evenodd" d="M12 9V7H8V5h4V3l4 3l-4 3zm-2 3H6V3L2 1h8v3h1V1c0-.55-.45-1-1-1H1C.45 0 0 .45 0 1v11.38c0 .39.22.73.55.91L6 16.01V13h4c.55 0 1-.45 1-1V8h-1v4z" fill="currentColor" />
        </svg>
      </ButtonWithSvg>
    </header>
  );
}

export default Header;