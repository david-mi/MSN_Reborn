import { Dispatch, SetStateAction } from "react";
import styles from "./displayAvatarsButton.module.css";

interface Props {
  setDisplayAvatars: Dispatch<SetStateAction<boolean>>
}

function DisplayAvatarsButton({ setDisplayAvatars }: Props) {
  function toggleDisplayAvatars() {
    setDisplayAvatars((state) => !state)
  }

  return (
    <button onClick={toggleDisplayAvatars} className={styles.displayAvatarsButton}>
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6l1.41-1.41z"></path></svg>
    </button>
  );
}

export default DisplayAvatarsButton;