import Loader from "@/Components/Shared/Loader/Loader";
import styles from "./defaultAvatars.module.css";
import ImageLoadWrapper from "@/Components/Shared/ImageLoadWrapper/ImageLoadWrapper";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "react-hook-form";
import type { ProfileFormFields } from "../../types";
import RecuperationError from "./RecuperationError/RecuperationError";

interface Props {
  picturesComponents: string[]
  loadNextPicture: () => void
}

function DefaultAvatars({ picturesComponents, loadNextPicture }: Props) {
  const { getDefaultAvatarsStatus } = useAppSelector(({ register }) => register.profile)
  const { setValue, clearErrors } = useFormContext<ProfileFormFields>()


  function handleClick(imageUrl: string) {
    return function () {
      clearErrors("avatarSrc")
      setValue("avatarSrc", imageUrl)
    }
  }

  if (getDefaultAvatarsStatus === "PENDING") {
    return <Loader className={styles.loader} />
  }

  if (getDefaultAvatarsStatus === "REJECTED") {
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