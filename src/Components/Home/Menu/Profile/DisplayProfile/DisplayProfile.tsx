import { MouseEvent } from "react";
import { useAppSelector } from "@/redux/hooks";
import { Avatar } from "@/Components/Shared";
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";
import type { EditProfileFormFields } from "../EditProfileForm/types";
import styles from "./displayProfile.module.css";
import { Loader } from "@/Components/Shared";
import useProfile from "@/hooks/useProfile";

interface Props {
  openEditProfileForm: (buttonTarget: keyof Omit<EditProfileFormFields, "avatarSrc">) => void
}

function DisplayProfile({ openEditProfileForm }: Props) {
  const { isLoadingForTheFirstTime } = useProfile()
  const avatarSrc = useAppSelector(({ user }) => user.avatarSrc)
  const username = useAppSelector(({ user }) => user.username)
  const displayedStatus = useAppSelector(({ user }) => user.displayedStatus)
  const personalMessage = useAppSelector(({ user }) => user.personalMessage)
  const classNames = `${styles.displayProfile} ${isLoadingForTheFirstTime ? styles.loading : ""}`

  function handleButtonClick({ currentTarget }: MouseEvent<HTMLButtonElement>) {
    const buttonTarget = currentTarget.dataset.target as keyof Omit<EditProfileFormFields, "avatarSrc">

    openEditProfileForm(buttonTarget)
  }

  return (
    <div className={classNames}>
      {isLoadingForTheFirstTime
        ? <Loader size={"2rem"} className={styles.loader} />
        : (
          <>
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
          </>
        )
      }
    </div>
  );
}

export default DisplayProfile;