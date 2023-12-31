import { useFormContext } from "react-hook-form";
import { Loader, ImageLoadWrapper } from "@/Components/Shared";
import RecuperationError from "./RecuperationError/RecuperationError";
import { useAppSelector } from "@/redux/hooks";
import type { ProfileFormFields } from "../../types";
import styles from "./defaultAvatars.module.css";

interface Props {
  picturesComponents: string[]
  loadNextPicture: () => void
}

function DefaultAvatars({ picturesComponents, loadNextPicture }: Props) {
  const getDefaultAvatarsRequestStatus = useAppSelector(({ register }) => register.getDefaultAvatarsRequest.status)
  const { setValue, clearErrors } = useFormContext<ProfileFormFields>()

  function handleClick(imageUrl: string) {
    return function () {
      clearErrors("avatarSrc")
      setValue("avatarSrc", imageUrl)
    }
  }

  if (getDefaultAvatarsRequestStatus === "PENDING") {
    return <Loader className={styles.loader} size="40%" />
  }

  if (getDefaultAvatarsRequestStatus === "REJECTED") {
    return <RecuperationError />
  }

  return (
    <div className={styles.defaultAvatars}>
      {picturesComponents.map((picture, index) => {
        return (
          <ImageLoadWrapper
            key={index}
            wrapperTagName="button"
            wrapperProps={{
              type: "button",
              onClick: handleClick(picture),
              className: styles.defaultPictureButton
            }}
            imageProps={{
              src: picture,
              onLoad: loadNextPicture
            }}
          />
        )
      })}
    </div>
  );
}

export default DefaultAvatars;