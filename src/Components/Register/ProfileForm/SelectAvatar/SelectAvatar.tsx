
import { useState, Dispatch, SetStateAction, MouseEvent, useEffect, ChangeEvent } from "react"
import styles from "./selectAvatar.module.css"
import { defaultAvatarsMiddleware, setAvatarUrl } from "@/redux/slices/register/register"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import DefaultAvatars from "./DefaultAvatars/DefaultAvatars"
import AddOrPreview from "./AddOrPreview/AddOrPreview"

interface Props {
  setSelectedAvatar: Dispatch<SetStateAction<File | Blob | null>>
  handleAddFile: (event: ChangeEvent<HTMLInputElement>) => void
}

function SelectAvatar({ setSelectedAvatar, handleAddFile }: Props) {
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
    if (getDefaultAvatarsStatus === "IDLE" && picturesComponents.length === 0) {
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
      <AddOrPreview handleAddFile={handleAddFile} />
      <DefaultAvatars
        picturesComponents={picturesComponents}
        handleDefaultPictureClick={handleDefaultPictureClick}
        loadNextPicture={loadNextPicture}
      />
    </div >
  )
}

export default SelectAvatar