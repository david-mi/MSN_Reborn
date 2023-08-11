import { ImageLoadWrapper, Avatar } from "@/Components/Shared";
import useContact from "@/hooks/useContact";
import styles from "./contactsList.module.css"
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";
import { useAppDispatch } from "@/redux/hooks";
import { setcurrentDisplayedRoom } from "@/redux/slices/room/room";

function ContactsList() {
  const dispatch = useAppDispatch()
  const { contacts, contactsError } = useContact()

  if (contactsError) {
    return <small>Une erreur est survenue lors de la récupération des contacts</small>
  }

  return (
    <ul className={styles.container}>
      {contacts.map(({ email, username, displayedStatus, avatarSrc, personalMessage }) => {
        return (
          <li className={styles.contactsList} key={email} onClick={
            () => {
              dispatch(setcurrentDisplayedRoom({
                type: "oneToOne",
                id: "fakeid",
                users: [],
                messages: [],
              }))
            }}>
            <div className={styles.avatarContainer}>
              <Avatar src={avatarSrc} size="small" />
              <ImageLoadWrapper
                imageProps={{ src: statusesObject[displayedStatus].icon, alt: "icône du status de l'utilisateur" }}
                loaderOptions={{ size: "16px", thickness: "2px" }}
              />
            </div>
            <span>{username}</span>
            <small> {personalMessage}</small>
          </li>
        )
      })}
    </ul>
  );
}

export default ContactsList;