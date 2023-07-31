import { Avatar, ModaleLayout } from "@/Components/Shared";
import { Button } from "@/Components/Shared";
import styles from "./friendRequestAlert.module.css"
import { acceptFriendRequest, denyFriendRequest } from "@/redux/slices/contact/contact";
import { UserProfileWithId } from "./types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface Props {
  userWhoSentFriendRequest: UserProfileWithId
}

function FriendRequestAlert({ userWhoSentFriendRequest }: Props) {
  const { avatarSrc, username, id, email } = userWhoSentFriendRequest
  const dispatch = useAppDispatch()
  const request = useAppSelector(({ contact }) => contact.request)

  function handleAcceptButtonClick() {
    dispatch(acceptFriendRequest(id))
  }

  function handleDenyButtonClick() {
    dispatch(denyFriendRequest(id))
  }

  return (
    <ModaleLayout title="Demande de contact" closable overlay>
      <div className={styles.container}>
        <div className={styles.infos}>
          <h2 className={styles.username}>{username}</h2>
          <small className={styles.email}>({email})</small>
          <Avatar size="medium" src={avatarSrc} />
          <p>Souhaite faire partie de vos contacts</p>
        </div>
        <div className={styles.submitButtonContainer}>
          <Button
            theme="gradient"
            title="Accepter"
            onClick={handleAcceptButtonClick}
            disabled={request.status === "PENDING"}
          />
          <Button
            theme="monochrome"
            title="Refuser"
            disabled={request.status === "PENDING"}
            onClick={handleDenyButtonClick}
          />
          <small data-testid="register-verification-submit-error">{request.error}</small>
        </div>
      </div>
    </ModaleLayout>
  );
}

export default FriendRequestAlert;