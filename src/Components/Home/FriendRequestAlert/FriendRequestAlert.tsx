import { ModaleLayout } from "@/Components/Shared";
import { Button } from "@/Components/Shared";
import styles from "./friendRequest.module.css"

function FriendRequestAlert() {
  return (
    <ModaleLayout title="Vous avez une demande d'ami" closable overlay>
      <div className={styles.container}>
        <div className={styles.infos}>
          <p>xXx Vous a demandé en ami</p>
        </div>
        <div className={styles.submitButtonContainer}>
          <Button theme="monochrome" title="Accepter" />
          <Button theme="monochrome" title="Refuser" />
          <small data-testid="register-verification-submit-error">"error"</small>
        </div>
      </div>
    </ModaleLayout>
  );
}

export default FriendRequestAlert;