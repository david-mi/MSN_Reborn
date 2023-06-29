import styles from "./avatar.module.css"
import avatarPlaceholder from "./avatar-placeholder.jpg"

interface Props {
  size: "medium" | "small"
  className?: string
  src?: string
}

function Avatar({ size, className, src = avatarPlaceholder }: Props) {
  const classNames = `${styles.avatar} ${styles[size]} ${className ? className : ""}`

  return (
    <div className={classNames}>
      <img src={src} alt="Avatar de l'utilisateur" />
    </div>
  )
}

export default Avatar