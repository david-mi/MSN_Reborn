
import { useState, Dispatch, SetStateAction, MouseEvent, useEffect } from "react"
import Avatar from "@/Components/Shared/Avatar/Avatar"
import styles from "./selectAvatar.module.css"
import ImageLoadWrapper from "@/Components/Shared/ImageLoadWrapper/ImageLoadWrapper"
import { defaultAvatarsMiddleware } from "@/redux/slices/register/register"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

interface Props {
  setSelectedAvatar: Dispatch<SetStateAction<File | Blob | null>>
  children: JSX.Element[]
}

function SelectAvatar({ setSelectedAvatar, children }: Props) {
  const [picturesComponents, setPicturesComponent] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const { defaultAvatars, getDefaultAvatarsStatus } = useAppSelector(state => state.register.profile)

  function loadNextPicture() {
    const nextPictureToLoad = defaultAvatars[picturesComponents.length]
    if (!nextPictureToLoad) return

    setPicturesComponent(picturesComponents => {
      return [
        ...picturesComponents,
        nextPictureToLoad
      ]
    })
  }

  useEffect(() => {
    dispatch(defaultAvatarsMiddleware())
  }, [])

  useEffect(() => {
    if (getDefaultAvatarsStatus === "IDLE") {
      setPicturesComponent([defaultAvatars[0]])
    }
  }, [getDefaultAvatarsStatus])

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