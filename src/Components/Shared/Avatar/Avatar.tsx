import styles from "./avatar.module.css"
import avatarPlaceholder from "./avatar-placeholder.jpg"

interface Props {
  size: "medium" | "small"
  className?: string
}

function Avatar({ size, className }: Props) {
  const classNames = `${styles.avatar} ${styles[size]} ${className ? className : ""}`

  return (
    <div className={classNames}>
      <img src={avatarPlaceholder} alt="Avatar de l'utilisateur" />
    </div>
  )
}

export default Avatar