import { useAppSelector } from "@/redux/hooks";
import styles from "./displayProfile.module.css";
import { Avatar } from "@/Components/Shared";

interface Props {
  toggleProfileState: () => void
}

function DisplayProfile({ toggleProfileState }: Props) {
  const avatarSrc = useAppSelector(({ user }) => user.avatarSrc)
  const username = useAppSelector(({ user }) => user.username)
  const displayedStatus = useAppSelector(({ user }) => user.displayedStatus)
  const personalMessage = useAppSelector(({ user }) => user.personalMessage)

  return (
    <div className={styles.displayProfile} onClick={toggleProfileState}>
      <Avatar size="small" src={avatarSrc} />
      <p>{username}</p>
      <p>({displayedStatus})</p>
      <p>{personalMessage}</p>
    </div>
  );
}

export default DisplayProfile;