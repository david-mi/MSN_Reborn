import useContact from "@/hooks/useContact";
import styles from "./contactsList.module.css"
import Contact from "./DisplayedContact/DisplayedContact";
import { useState } from "react";
import { Loader, ArrowIconLarge } from "@/Components/Shared";

function ContactsList() {
  const {
    onlineContactsProfileList,
    onlineContactsCount,
    offlineContactsProfileList,
    offlineContactsCount,
    retrieveContactsStatus,
    contactsError
  } = useContact()
  const [displayOnlineContacts, setDisplayOnlineContacts] = useState(true)
  const [displayOfflineContacts, setDisplayOfflineContacts] = useState(false)

  if (contactsError) {
    return <small>Une erreur est survenue lors de la récupération des contacts</small>
  }

  if (retrieveContactsStatus === "PENDING") {
    return <Loader size="2rem" />
  }

  function toggleDisplayOnlineContacts() {
    setDisplayOnlineContacts((state) => !state)
  }

  function toggleDisplayOfflineContacts() {
    setDisplayOfflineContacts((state) => !state)
  }

  return (
    <div className={styles.container}>
      {onlineContactsCount > 0 && (
        <div className={styles.online}>
          <button className={styles.title} onClick={toggleDisplayOnlineContacts}>
            <ArrowIconLarge className={displayOnlineContacts ? styles.display : ""} />
            <span>En ligne</span>
            <span className={styles.counter}>( {onlineContactsCount} )</span>
          </button>
          {displayOnlineContacts && onlineContactsProfileList.map((contact) => <Contact key={contact.id} contact={contact} />)}
        </div>
      )}
      {offlineContactsCount > 0 && (
        <div className={styles.offline}>
          <button className={styles.title} onClick={toggleDisplayOfflineContacts}>
            <ArrowIconLarge className={displayOfflineContacts ? styles.display : ""} />
            <span>Hors ligne</span>
            <span className={styles.counter}>( {offlineContactsCount} )</span>
          </button>
          {displayOfflineContacts && offlineContactsProfileList.map((contact) => <Contact key={contact.id} contact={contact} />)}
        </div>
      )}
    </div>
  );
}

export default ContactsList;