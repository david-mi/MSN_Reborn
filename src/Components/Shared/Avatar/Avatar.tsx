import avatarPlaceholder from "./avatar-placeholder.jpg"
import ImageLoadWrapper from "../ImageLoadWrapper/ImageLoadWrapper"
import type { ComponentProps } from "react"
import styles from "./avatar.module.css"

interface Props {
  size: "medium" | "small" | "dynamic"
  className?: string
  src?: string
}

function Avatar({ size, className, src }: Props) {
  const classNames = `${styles.avatar} ${styles[size]} ${className ? className : ""}`

  return (
    <div className={classNames}>
      <ImageLoadWrapper
        loaderOptions={{ size: "50%" }}
        wrapperProps={{ className: styles.wrapper }}
        imageProps={{
          src: src || avatarPlaceholder,
          ["data-testid" as keyof ComponentProps<"img">]: "avatar-img",
          alt: "Avatar de l'utilisateur"
        }}
      />
    </div>
  )
}

export default Avatar