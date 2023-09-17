import { Avatar, ModaleLayout } from "@/Components/Shared";
import { Button } from "@/Components/Shared";
import styles from "./friendRequestAlert.module.css"
import { acceptFriendRequest, denyFriendRequest } from "@/redux/slices/contact/contact";
import { UserProfile } from "@/redux/slices/user/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface Props {
  userWhoSentFriendRequest: UserProfile
}

function FriendRequestAlert({ userWhoSentFriendRequest }: Props) {
  const { avatarSrc, username, id, email } = userWhoSentFriendRequest
  const dispatch = useAppDispatch()
  const request = useAppSelector(({ contact }) => contact.request)

  function handleAcceptButtonClick() {
    dispatch(acceptFriendRequest({
      requestingUserId: id,
      requestedUsername: username
    }))
  }

  function handleDenyButtonClick() {
    dispatch(denyFriendRequest({
      requestingUserId: id,
      requestedUsername: username
    }))
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