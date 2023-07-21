import type { Dispatch, SetStateAction, MouseEvent } from "react";
import statuses from "../statusesData";
import type { DisplayedStatus } from "@/redux/slices/user/types";
import { ImageLoadWrapper } from "../..";
import styles from "./displayedStatusesList.module.css";

interface Props {
  setStatusSentence: Dispatch<SetStateAction<string>>
  setShowStatusesList: Dispatch<SetStateAction<boolean>>
  setStatus: (status: DisplayedStatus) => void
}

function DisplayedStatusesList({ setStatusSentence, setStatus, setShowStatusesList }: Props) {
  function handleStatusClick({ currentTarget }: MouseEvent) {
    const retrievedStatus = (currentTarget as HTMLLIElement).dataset.key as DisplayedStatus
    const retrievedStatusSentence = (currentTarget as HTMLLIElement).innerText

    setStatusSentence(retrievedStatusSentence)
    setStatus(retrievedStatus)
    closeShowStatusMenu()
  }

  function closeShowStatusMenu() {
    setShowStatusesList(false)
  }

  return (
    <ul className={styles.displayedStatusesList}>
      <div className={styles.bgHide} onClick={closeShowStatusMenu}></div>
      {statuses.map((status) => {
        return (
          <li
            key={status.key}
            data-key={status.key}
            onClick={handleStatusClick}
          >
            <ImageLoadWrapper
              imageProps={{ src: status.icon, alt: "icône du status de l'utilisateur" }}
              loaderOptions={{ size: "16px", thickness: "2px" }}
            />
            <span>{status.sentence}</span>
          </li>
        )
      })}
    </ul>
  );
}

export default DisplayedStatusesList;