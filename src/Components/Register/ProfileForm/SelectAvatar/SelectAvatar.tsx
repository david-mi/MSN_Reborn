
import { useState, useEffect } from "react"
import styles from "./selectAvatar.module.css"
import { getDefaultAvatars } from "@/redux/slices/register/register"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import DefaultAvatars from "./DefaultAvatars/DefaultAvatars"
import AddOrPreview from "./AddOrPreview/AddOrPreview"
import { useFormContext } from "react-hook-form"
import type { ProfileFormFields } from "../types"

function SelectAvatar() {
  const [picturesComponents, setPicturesComponent] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const { defaultAvatars, getDefaultAvatarsStatus } = useAppSelector(state => state.register.profile)
  const { formState: { errors } } = useFormContext<ProfileFormFields>()

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
    dispatch(getDefaultAvatars())
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
      <small>{errors.avatarSrc?.message}</small>
    </div >
  )
}

export default SelectAvatar