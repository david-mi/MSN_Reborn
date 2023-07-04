import { useState, SyntheticEvent, createElement, ComponentProps } from "react";
import Loader from "../Loader/Loader";
import styles from "./imageLoadWrapper.module.css";

type Props<T extends keyof JSX.IntrinsicElements> = {
  wrapperTagName?: T,
  wrapperProps?: ComponentProps<T>
  imageProps: Partial<ComponentProps<"img">> & {
    src: string
  }
  loaderOptions?: {
    size: string
  }
}

function ImageLoadWrapper<T extends keyof JSX.IntrinsicElements>(props: Props<T>) {
  const { imageProps, wrapperTagName = "div", wrapperProps = {}, loaderOptions } = props
  const [loaded, setLoaded] = useState(false)
  const imageClassNames = `${loaded ? "" : styles.hide} ${imageProps.className ? imageProps.className : ""}`

  function handleImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    setLoaded(true)

    if (typeof imageProps.onLoad === "function") {
      imageProps.onLoad(event)
    }
  }

  return createElement(
    wrapperTagName,
    { ...wrapperProps },
    <>
      {!loaded && <Loader size={loaderOptions?.size} />}
      <img
        alt="Avatar par défaut à choisir"
        {...imageProps}
        onLoad={handleImageLoad}
        className={imageClassNames}
      />
    </>
  )
}

export default ImageLoadWrapper