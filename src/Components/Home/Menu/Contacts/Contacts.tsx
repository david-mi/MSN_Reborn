import Heading from "./Heading/Heading";
import styles from "./contacts.module.css";
import ContactsList from "./ContactsList/ContactsList";

function Contacts() {
  return (
    <div className={styles.contacts}>
      <Heading />
      <ContactsList />
    </div>
  );
}

export default Contacts;