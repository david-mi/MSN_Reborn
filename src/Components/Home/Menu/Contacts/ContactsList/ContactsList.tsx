import useContact from "@/hooks/useContact";
import styles from "./contactsList.module.css"
import useRoom from "@/hooks/useRoom";
import Contact from "./DisplayedContact/DisplayedContact";

function ContactsList() {
  const { isLoadingRoomsForTheFirstTime } = useRoom()
  const { contacts, contactsError } = useContact(isLoadingRoomsForTheFirstTime)

  if (contactsError) {
    return <small>Une erreur est survenue lors de la récupération des contacts</small>
  }

  return (
    <ul className={styles.container}>
      {contacts.map((contact) => <Contact key={contact.id} contact={contact} />)}
    </ul>
  );
}

export default ContactsList;