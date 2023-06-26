
import { defaultPictures } from "./defaultPictures"
import Avatar from "@/Components/Avatar/Avatar"
import styles from "./selectAvatar.module.css"

function SelectAvatar() {
  return (
    <div className={styles.selectAvatar}>
      <Avatar size="medium" className={styles.avatar} />
      <div className={styles.avatars}>
        {defaultPictures.map((picture, index) => {
          return (
            <button key={index}>
              <img src={picture} alt="Avatar par défaut à choisir" />
            </button>
          )
        })}
        <button>+</button>
      </div>
    </div>
  )
}

export default SelectAvatar