import { MouseEvent } from "react";
import Loader from "@/Components/Shared/Loader/Loader";
import styles from "./defaultAvatars.module.css";
import ImageLoadWrapper from "@/Components/Shared/ImageLoadWrapper/ImageLoadWrapper";
import { useAppSelector } from "@/redux/hooks";

interface Props {
  picturesComponents: string[]
  loadNextPicture: () => void
  handleDefaultPictureClick: (event: MouseEvent<HTMLButtonElement>) => void
}

function DefaultAvatars({ picturesComponents, loadNextPicture, handleDefaultPictureClick }: Props) {
  const getDefaultAvatarsStatus = useAppSelector(({ register }) => register.profile.getDefaultAvatarsStatus)

  if (getDefaultAvatarsStatus !== "IDLE") {
    return <Loader className={styles.loader} />
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
              onClick: handleDefaultPictureClick,
              className: styles.defaultPictureButton
            }}
          />
        )
      })}
    </div>
  );
}

export default DefaultAvatars;