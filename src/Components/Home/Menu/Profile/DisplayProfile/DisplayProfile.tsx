import { useEffect, MouseEvent, useState } from "react";
import { UserService } from "@/Services";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setProfile } from "@/redux/slices/user/user";
import { Avatar } from "@/Components/Shared";
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";
import type { EditProfileFormFields } from "../EditProfileForm/types";
import { doc, onSnapshot } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import styles from "./displayProfile.module.css";
import { UserProfile } from "@/redux/slices/user/types";
import { Loader } from "@/Components/Shared";

interface Props {
  openEditProfileForm: (buttonTarget: keyof Omit<EditProfileFormFields, "avatarSrc">) => void
}

function DisplayProfile({ openEditProfileForm }: Props) {
  const dispatch = useAppDispatch()
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const avatarSrc = useAppSelector(({ user }) => user.avatarSrc)
  const username = useAppSelector(({ user }) => user.username)
  const displayedStatus = useAppSelector(({ user }) => user.displayedStatus)
  const personalMessage = useAppSelector(({ user }) => user.personalMessage)
  const classNames = `${styles.displayProfile} ${isLoadingProfile ? styles.loading : ""}`

  function handleButtonClick({ currentTarget }: MouseEvent<HTMLButtonElement>) {
    const buttonTarget = currentTarget.dataset.target as keyof Omit<EditProfileFormFields, "avatarSrc">

    openEditProfileForm(buttonTarget)
  }

  useEffect(() => {
    const userRef = doc(firebase.firestore, "users", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(userRef, async (snapshot) => {
      const userProfile = snapshot.data() as UserProfile
      dispatch(setProfile(userProfile))
      setIsLoadingProfile(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className={classNames}>
      {isLoadingProfile
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