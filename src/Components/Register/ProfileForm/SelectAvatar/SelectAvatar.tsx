
import { useState, useEffect } from "react"
import styles from "./selectAvatar.module.css"
import { defaultAvatarsMiddleware } from "@/redux/slices/register/register"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import DefaultAvatars from "./DefaultAvatars/DefaultAvatars"
import AddOrPreview from "./AddOrPreview/AddOrPreview"

function SelectAvatar() {
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
    const isReadyToLoadFirstDefaultAvatar = getDefaultAvatarsStatus === "IDLE" && picturesComponents.length === 0

    if (isReadyToLoadFirstDefaultAvatar) {
      setPicturesComponent([defaultAvatars[0]])
    }
  }, [getDefaultAvatarsStatus])

  return (
    <div className={styles.selectAvatar}>
      <AddOrPreview />
      <DefaultAvatars
        picturesComponents={picturesComponents}
        loadNextPicture={loadNextPicture}
      />
    </div >
  )
}

export default SelectAvatar