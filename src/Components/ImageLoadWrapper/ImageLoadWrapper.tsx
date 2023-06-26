import { useState, SyntheticEvent, createElement, ComponentProps } from "react";
import Loader from "./Loader/Loader";
import styles from "./imageLoadWrapper.module.css";

type Props<T extends keyof JSX.IntrinsicElements> = {
  src: string,
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void
  wrapperTagName?: T,
  wrapperProps?: ComponentProps<T>
}

function ImageLoadWrapper<T extends keyof JSX.IntrinsicElements>(props: Props<T>) {
  const { src, onLoad, wrapperTagName = "div", wrapperProps = {} } = props
  const [loaded, setLoaded] = useState(false)
  const imageClassName = `${loaded ? "" : styles.hide}`

  function handleImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    setLoaded(true)

    if (typeof onLoad === "function") {
      onLoad(event)
    }
  }

  return createElement(
    wrapperTagName,
    { ...wrapperProps },
    <>
      {!loaded && <Loader />}
      <img
        className={imageClassName}
        onLoad={handleImageLoad}
        src={src}
        alt="Avatar par défaut à choisir"
      />
    </>
  )
}

export default ImageLoadWrapper