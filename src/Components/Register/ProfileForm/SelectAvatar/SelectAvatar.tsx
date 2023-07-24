
import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { getDefaultAvatars } from "@/redux/slices/register/register"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import DefaultAvatars from "./DefaultAvatars/DefaultAvatars"
import AddOrPreview from "./AddOrPreview/AddOrPreview"
import type { ProfileFormFields } from "../types"
import styles from "./selectAvatar.module.css"

function SelectAvatar() {
  const [picturesComponents, setPicturesComponent] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const getDefaultAvatarsRequestStatus = useAppSelector(({ register }) => register.getDefaultAvatarsRequest.status)
  const defaultAvatars = useAppSelector(({ register }) => register.defaultAvatars)
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
    const isReadyToLoadFirstDefaultAvatar = defaultAvatars.length !== 0 && picturesComponents.length === 0

    if (isReadyToLoadFirstDefaultAvatar) {
      setPicturesComponent([defaultAvatars[0]])
    }
  }, [getDefaultAvatarsRequestStatus])

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