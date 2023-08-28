import useContact from "@/hooks/useContact";
import styles from "./contactsList.module.css"
import useRoom from "@/hooks/useRoom";
import Contact from "./DisplayedContact/DisplayedContact";

function ContactsList() {
  useRoom()
  const { contacts, contactsError } = useContact()

  if (contactsError) {
    return <small>Une erreur est survenue lors de la récupération des contacts</small>
  }

  return (
    <ul className={styles.container}>
      <h2 className={styles.title}>Contacts</h2>
      {contacts.map((contact) => <Contact key={contact.id} contact={contact} />)}
    </ul>
  );
}

export default ContactsList;