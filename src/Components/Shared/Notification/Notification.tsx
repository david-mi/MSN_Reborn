import { ModaleLayout, Button } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./notification.module.css"
import type { Notification } from "@/redux/slices/notification/types";
import { deleteNotification } from "@/redux/slices/notification/notification";

interface Props {
  notification: Notification
}

function Notification({ notification }: Props) {
  const dispatch = useAppDispatch()
  const notificationRequest = useAppSelector(({ notification }) => notification.request)

  function handleDeleteButtonClick() {
    dispatch(deleteNotification(notification.id))
  }

  return (
    <ModaleLayout title="Notification" overlay>
      <div className={styles.container}>
        <div className={styles.infos}>
          <h2 className={styles.target}>{notification.target}</h2>
          <p>{notification.content}</p>
        </div>
        <div className={styles.submitButtonContainer}>
          <Button
            theme="gradient"
            title="Ok"
            onClick={handleDeleteButtonClick}
            disabled={notificationRequest.status === "PENDING"}
          />
          <small>{notificationRequest.error}</small>
        </div>
      </div>
    </ModaleLayout>
  );
}

export default Notification;