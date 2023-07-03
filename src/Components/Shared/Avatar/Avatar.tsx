import styles from "./avatar.module.css"
import avatarPlaceholder from "./avatar-placeholder.jpg"

interface Props {
  size: "medium" | "small"
  className?: string
  src?: string
}

function Avatar({ size, className, src }: Props) {
  const classNames = `${styles.avatar} ${styles[size]} ${className ? className : ""}`

  return (
    <div className={classNames}>
      <img
        src={src || avatarPlaceholder}
        data-testid="avatar-img"
        alt="Avatar de l'utilisateur"
      />
    </div>
  )
}

export default Avatar