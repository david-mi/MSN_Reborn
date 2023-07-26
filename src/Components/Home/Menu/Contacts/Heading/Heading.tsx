import { ButtonWithImage } from "@/Components/Shared";
import addContactIcon from "/icons/add-contact.png"
import styles from "./heading.module.css";

function Heading() {
  return (
    <div className={styles.heading}>
      <ButtonWithImage
        src={addContactIcon}
        className={styles.addContactButton}
      />
    </div>
  );
}

export default Heading;