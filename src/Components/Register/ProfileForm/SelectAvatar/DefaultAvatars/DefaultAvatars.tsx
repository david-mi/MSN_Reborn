import Loader from "@/Components/Shared/Loader/Loader";
import styles from "./defaultAvatars.module.css";
import ImageLoadWrapper from "@/Components/Shared/ImageLoadWrapper/ImageLoadWrapper";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setavatarSrc } from "@/redux/slices/register/register";

interface Props {
  picturesComponents: string[]
  loadNextPicture: () => void
}

function DefaultAvatars({ picturesComponents, loadNextPicture }: Props) {
  const getDefaultAvatarsStatus = useAppSelector(({ register }) => register.profile.getDefaultAvatarsStatus)
  const dispatch = useAppDispatch()

  if (getDefaultAvatarsStatus !== "IDLE") {
    return <Loader className={styles.loader} />
  }

  function handleClick(imageUrl: string) {
    return function () {
      dispatch(setavatarSrc(imageUrl))
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