import type { MouseEvent } from "react";
import { useAppSelector } from "@/redux/hooks";
import styles from "./displayProfile.module.css";
import { Avatar } from "@/Components/Shared";
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";
import type { EditProfileFormFields } from "../EditProfileForm/types";

interface Props {
  openEditProfileForm: (buttonTarget: keyof Omit<EditProfileFormFields, "avatarSrc">) => void
}

function DisplayProfile({ openEditProfileForm }: Props) {
  const avatarSrc = useAppSelector(({ user }) => user.avatarSrc)
  const username = useAppSelector(({ user }) => user.username)
  const displayedStatus = useAppSelector(({ user }) => user.displayedStatus)
  const personalMessage = useAppSelector(({ user }) => user.personalMessage)

  function handleButtonClick({ currentTarget }: MouseEvent<HTMLButtonElement>) {
    const buttonTarget = currentTarget.dataset.target as keyof Omit<EditProfileFormFields, "avatarSrc">

    openEditProfileForm(buttonTarget)
  }

  return (
    <div className={styles.displayProfile}>
      <button onClick={handleButtonClick} >
        <Avatar size="small" src={avatarSrc} />
      </button>
      <button onClick={handleButtonClick} data-target="username">
        {username}
      </button>
      <button onClick={handleButtonClick} data-target="displayedStatus">
        ({statusesObject[displayedStatus]?.sentence})
      </button>
      <button title={personalMessage} onClick={handleButtonClick} data-target="personalMessage">
        {personalMessage !== ""
          ? personalMessage
          : "<Tapez votre message perso>"
        }
      </button>
    </div>
  );
}

export default DisplayProfile;