import { Dispatch, SetStateAction } from "react";
import styles from "./toggleUsersPanelButton.module.css";

interface Props {
  setDisplayUsersPanel: Dispatch<SetStateAction<boolean>>
  displayUsersPanel: boolean
}

function ToggleUsersPanelButton({ setDisplayUsersPanel, displayUsersPanel }: Props) {
  const classNames = `${styles.toggleUsersPanelButton} ${displayUsersPanel ? styles.isOpen : ""}`

  function toggleUsersPanel() {
    setDisplayUsersPanel((state) => !state)
  }

  return (
    <button onClick={toggleUsersPanel} className={classNames}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M11.5 16V8l-4 4l4 4ZM5 19h9V5H5v14Zm-2 2V3h18v18H3Z"></path>
      </svg>
    </button>
  );
}

export default ToggleUsersPanelButton;