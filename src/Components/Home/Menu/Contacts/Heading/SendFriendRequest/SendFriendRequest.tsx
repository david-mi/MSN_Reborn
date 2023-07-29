import { useState } from "react"
import styles from "./sendFriendRequest.module.css";
import SendFriendRequestForm from "./SendFriendRequestForm/SendFriendRequestForm";
import { ButtonWithImage } from "@/Components/Shared";
import addContactIcon from "/icons/add-contact.png"

function SendFriendRequest() {
  const [sendContactRequestFormOpen, setSendContactRequestFormOpen] = useState(false)

  function toggleSendFriendRequestForm() {
    setSendContactRequestFormOpen((state) => !state)
  }

  return sendContactRequestFormOpen
    ? <SendFriendRequestForm toggleSendFriendRequestForm={toggleSendFriendRequestForm} />
    : (
      <ButtonWithImage
        onClick={toggleSendFriendRequestForm}
        src={addContactIcon}
        className={styles.addContactButton}
      />
    )
}

export default SendFriendRequest;