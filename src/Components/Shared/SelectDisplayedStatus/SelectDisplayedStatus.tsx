import { useState } from "react"
import { statusesObject } from "./statusesData";
import type { DisplayedStatus } from "@/redux/slices/user/types";
import { DisplayedStatusLabel, DisplayedStatusesList } from ".";
import styles from "./selectShowStatus.module.css";

interface Props {
  setStatus: (status: DisplayedStatus) => void
  defaultStatus?: string
  defaultListOpen?: boolean
}

function SelectDisplayedStatus({
  setStatus,
  defaultStatus = statusesObject.online.sentence,
  defaultListOpen = false
}: Props) {
  const [statusSentence, setStatusSentence] = useState(defaultStatus)
  const [showStatusesList, setShowStatusesList] = useState(defaultListOpen)

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