
import { defaultPictures } from "./defaultPictures"
import styles from "./addAvatar.module.css"

function AddAvatar() {
  return (
    <div className={styles.addAvatar}>
      {defaultPictures.map((picture, index) => {
        return (
          <button key={index}>
            <img src={picture} alt="Avatar par défaut à choisir" />
          </button>
        )
      })}
      <button>+</button>
    </div>
  )
}
export default AddAvatar