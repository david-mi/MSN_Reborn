import styles from "./avatar.module.css"
import avatarPlaceholder from "./avatar-placeholder.jpg"

interface Props {
  size: "medium" | "small"
}

function Avatar({ size }: Props) {
  const className = `${styles.avatar} ${styles[size]}`

  return (
    <div className={className}>
      <img src={avatarPlaceholder} alt="Avatar de l'utilisateur" />
    </div>
  )
}

export default Avatar