import type { Dispatch, SetStateAction, MouseEvent } from "react";
import { statusesArray } from "../statusesData";
import type { DisplayedStatus } from "@/redux/slices/user/types";
import { ImageLoadWrapper } from "../..";
import styles from "./displayedStatusesList.module.css";
import { useFormContext } from "react-hook-form";
import type { UserProfile } from "@/redux/slices/user/types";

interface Props {
  setStatusSentence: Dispatch<SetStateAction<string>>
  setShowStatusesList: Dispatch<SetStateAction<boolean>>
}

function DisplayedStatusesList({ setStatusSentence, setShowStatusesList }: Props) {
  const { setValue } = useFormContext<Pick<UserProfile, "displayedStatus">>()

  function handleStatusClick({ currentTarget }: MouseEvent) {
    const retrievedStatus = (currentTarget as HTMLLIElement).dataset.key as DisplayedStatus
    const retrievedStatusSentence = (currentTarget as HTMLLIElement).innerText

    setStatusSentence(retrievedStatusSentence)
    setValue("displayedStatus", retrievedStatus)
    closeShowStatusMenu()
  }

  function closeShowStatusMenu() {
    setShowStatusesList(false)
  }

  return (
    <ul className={styles.displayedStatusesList}>
      <div className={styles.bgHide} onClick={closeShowStatusMenu}></div>
      {statusesArray.map((status) => {
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