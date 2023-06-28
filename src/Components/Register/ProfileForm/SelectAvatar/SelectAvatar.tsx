
import { useState, Dispatch, SetStateAction, MouseEvent } from "react"
import { defaultPictures } from "./defaultPictures"
import Avatar from "@/Components/Shared/Avatar/Avatar"
import styles from "./selectAvatar.module.css"
import ImageLoadWrapper from "@/Components/Shared/ImageLoadWrapper/ImageLoadWrapper"

interface Props {
  setSelectedAvatar: Dispatch<SetStateAction<File | Blob | null>>
  children: JSX.Element[]
}

function SelectAvatar({ setSelectedAvatar, children }: Props) {
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

  function handleDefaultPictureClick({ currentTarget }: MouseEvent) {
    const imageElement = currentTarget.children[0]
    // appeler le service pour convertir l'image en Blob
    // l'ajouter dans le state ensuite
    // pas besoin de contrôles car l'image respecte les conditions imposées
    console.log(imageElement)
    setSelectedAvatar(null)
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
                onClick: handleDefaultPictureClick,
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