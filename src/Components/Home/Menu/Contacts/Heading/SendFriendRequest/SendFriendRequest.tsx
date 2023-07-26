import { useState } from "react"
import styles from "./sendFriendRequest.module.css";
import SendFriendRequestForm from "./SendFriendRequestForm/SendFriendRequestForm";
import { ButtonWithImage } from "@/Components/Shared";
import addContactIcon from "/icons/add-contact.png"

function SendFriendRequest() {
  const [sendContactRequestFormOpen, setSendContactRequestFormOpen] = useState(false)

  function toggleSendContactRequestForm() {
    setSendContactRequestFormOpen((state) => !state)
  }

  return sendContactRequestFormOpen
    ? <SendFriendRequestForm toggleSendContactRequestForm={toggleSendContactRequestForm} />
    : (
      <ButtonWithImage
        onClick={toggleSendContactRequestForm}
        src={addContactIcon}
        className={styles.addContactButton}
      />
    )
}

export default SendFriendRequest;