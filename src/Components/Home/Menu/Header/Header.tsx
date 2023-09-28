import { useState } from "react";
import { ButtonWithSvg } from "@/Components/Shared";
import windowsLogo from "./windows-logo.png"
import { useAppDispatch } from "@/redux/hooks";
import { disconnect } from "@/redux/slices/user/user";
import styles from "./header.module.css";
import useOptions from "@/hooks/useOptions";
import Options from "../Options/Options";

function Header() {
  useOptions()
  const dispatch = useAppDispatch()
  const [displayOptions, setDisplayOptions] = useState(false)

  function toggleOptionsForm() {
    setDisplayOptions((state) => !state)
  }

  function handleDisconnect() {
    dispatch(disconnect())
  }

  return (
    <header className={styles.header}>
      <img src={windowsLogo} alt="Logo windows" />
      <h1 className={styles.title}>MSN <b>Reborn</b></h1>
      {displayOptions && <Options setDisplayOptions={setDisplayOptions} />}
      <ButtonWithSvg className={styles.optionsButton} onClick={toggleOptionsForm}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"></path>
        </svg>
      </ButtonWithSvg>
      <ButtonWithSvg className={styles.disconnectButton} onClick={handleDisconnect}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 16 17"><path fillRule="evenodd" d="M12 9V7H8V5h4V3l4 3l-4 3zm-2 3H6V3L2 1h8v3h1V1c0-.55-.45-1-1-1H1C.45 0 0 .45 0 1v11.38c0 .39.22.73.55.91L6 16.01V13h4c.55 0 1-.45 1-1V8h-1v4z" fill="currentColor" />
        </svg>
      </ButtonWithSvg>
    </header>
  );
}

export default Header;