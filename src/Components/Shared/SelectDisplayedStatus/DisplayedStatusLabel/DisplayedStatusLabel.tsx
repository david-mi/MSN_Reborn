import type { Dispatch, SetStateAction } from "react";
import { ArrowIcon } from "../..";
import styles from "./displayedStatusLabel.module.css";

interface Props {
  statusSentence: string,
  showStatusesList: boolean
  setShowStatusesList: Dispatch<SetStateAction<boolean>>
}

function DisplayedStatusLabel({ statusSentence, showStatusesList, setShowStatusesList }: Props) {
  function toggleStatusList() {
    setShowStatusesList((previousState) => !previousState)
  }

  return (
    <div className={styles.displayedStatusLabel} onClick={toggleStatusList}>
      Statut :
      <span className={showStatusesList ? styles.open : ""}>{statusSentence} <ArrowIcon /></span>
    </div>
  );
}

export default DisplayedStatusLabel;