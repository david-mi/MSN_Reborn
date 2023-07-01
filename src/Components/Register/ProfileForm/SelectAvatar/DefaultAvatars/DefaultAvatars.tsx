import Loader from "@/Components/Shared/Loader/Loader";
import styles from "./defaultAvatars.module.css";
import ImageLoadWrapper from "@/Components/Shared/ImageLoadWrapper/ImageLoadWrapper";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "react-hook-form";
import type { ProfileFormFields } from "../../types";

interface Props {
  picturesComponents: string[]
  loadNextPicture: () => void
}

function DefaultAvatars({ picturesComponents, loadNextPicture }: Props) {
  const getDefaultAvatarsStatus = useAppSelector(({ register }) => register.profile.getDefaultAvatarsStatus)
  const { setValue, clearErrors } = useFormContext<ProfileFormFields>()

  if (getDefaultAvatarsStatus !== "IDLE") {
    return <Loader className={styles.loader} />
  }

  function handleClick(imageUrl: string) {
    return function () {
      clearErrors("avatarSrc")
      setValue("avatarSrc", imageUrl)
    }
  }

  return (
    <div className={styles.defaultAvatars}>
      {picturesComponents.map((picture, index) => {
        return (
          <ImageLoadWrapper
            key={index}
            src={picture}
            onLoad={loadNextPicture}
            wrapperTagName="button"
            wrapperProps={{
              type: "button",
              onClick: handleClick(picture),
              className: styles.defaultPictureButton
            }}
          />
        )
      })}
    </div>
  );
}

export default DefaultAvatars;