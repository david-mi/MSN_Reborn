
import { useState, ChangeEvent } from "react"
import { defaultPictures } from "./defaultPictures"
import Avatar from "@/Components/Avatar/Avatar"
import styles from "./selectAvatar.module.css"
import ImageLoadWrapper from "@/Components/ImageLoadWrapper/ImageLoadWrapper"

interface Props {
  children: JSX.Element[]
}

function SelectAvatar({ children }: Props) {
  const [picturesComponents, setPicturesComponent] = useState<string[]>([defaultPictures[0]])

  function loadNextPicture() {
    const nextPictureToLoad = defaultPictures[picturesComponents.length]
    if (!nextPictureToLoad) return

    setPicturesComponent(picturesComponents => {
      return [
        ...picturesComponents,
        nextPictureToLoad
      ]
    })
  }

  return (
    <div className={styles.selectAvatar}>
      <Avatar size="medium" className={styles.avatar} />
      <div className={styles.avatars}>
        {picturesComponents.map((picture, index) => {
          return (
            <ImageLoadWrapper
              key={index}
              src={picture}
              onLoad={loadNextPicture}
              wrapperTagName="button"
              wrapperProps={{
                type: "button",
                onClick: (e) => console.log("click"),
                className: styles.defaultPictureButton
              }}
            />
          )
        })}
        {children}
      </div>
    </div>
  )
}

export default SelectAvatar