import { useState, SyntheticEvent, ComponentProps } from "react";
import { Loader } from "..";
import styles from "./imageLoadWrapper.module.css";

export type Props<T extends keyof JSX.IntrinsicElements> = {
  wrapperTagName?: T,
  wrapperProps?: ComponentProps<T>
  imageProps: Partial<ComponentProps<"img">> & {
    src: string
  }
  loaderOptions?: {
    size: string;
    thickness?: string;
  }
}

function ImageLoadWrapper<T extends keyof JSX.IntrinsicElements>(props: Props<T>) {
  const { imageProps, wrapperTagName = "div", wrapperProps = {}, loaderOptions } = props
  const [loaded, setLoaded] = useState(false)
  const imageClassNames = `${loaded ? "" : styles.hide} ${imageProps.className ? imageProps.className : ""}`
  const Wrapper = wrapperTagName as keyof JSX.IntrinsicElements

  function handleImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    setLoaded(true)

    if (typeof imageProps.onLoad === "function") {
      imageProps.onLoad(event)
    }
  }

  return (
    <Wrapper {...wrapperProps}>
      {!loaded && <Loader {...loaderOptions} />}
      <img
        alt="Avatar par défaut à choisir"
        {...imageProps}
        onLoad={handleImageLoad}
        className={imageClassNames}
      />
    </Wrapper >
  )
}

export default ImageLoadWrapper