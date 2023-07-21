import { useState } from "react"
import statuses from "./statusesData";
import type { DisplayedStatus } from "@/redux/slices/user/types";
import { DisplayedStatusLabel, DisplayedStatusesList } from ".";
import styles from "./selectShowStatus.module.css";

interface Props {
  setStatus: (status: DisplayedStatus) => void
}

function SelectDisplayedStatus({ setStatus }: Props) {
  const [statusSentence, setStatusSentence] = useState(statuses[0].sentence)
  const [showStatusesList, setShowStatusesList] = useState(false)

  return (
    <div className={styles.wrapper}>
      <DisplayedStatusLabel
        statusSentence={statusSentence}
        showStatusesList={showStatusesList}
        setShowStatusesList={setShowStatusesList}
      />
      {showStatusesList && (
        <DisplayedStatusesList
          setShowStatusesList={setShowStatusesList}
          setStatus={setStatus}
          setStatusSentence={setStatusSentence}
        />
      )}
    </div>
  );
}

export default SelectDisplayedStatus;