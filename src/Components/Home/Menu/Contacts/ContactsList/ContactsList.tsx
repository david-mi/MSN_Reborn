import { Loader, ImageLoadWrapper, Avatar } from "@/Components/Shared";
import useContact from "@/hooks/useContact";
import styles from "./contactsList.module.css"
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";

function ContactsList() {
  const { contacts, contactsError, isLoadingContacts } = useContact()

  if (isLoadingContacts) {
    return <Loader />
  }

  if (contactsError) {
    return <small>Une erreur est survenue lors de la récupération des contacts</small>
  }

  return (
    <ul className={styles.container}>
      {contacts.map(({ email, username, displayedStatus, avatarSrc, personalMessage }) => {
        return (
          <li className={styles.contactsList} key={email}>
            <Avatar src={avatarSrc} size="small" />
            <span>{username}</span>
            <span className={styles.status}>
              {statusesObject[displayedStatus].sentence}
              <ImageLoadWrapper
                imageProps={{ src: statusesObject[displayedStatus].icon, alt: "icône du status de l'utilisateur" }}
                loaderOptions={{ size: "16px", thickness: "2px" }}
              />
            </span>
            <small> {personalMessage}</small>
          </li>
        )
      })}
    </ul>
  );
}

export default ContactsList;