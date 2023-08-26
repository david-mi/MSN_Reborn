import { ImageLoadWrapper } from "..";
import styles from "./buttonWithImage.module.css";

type Props = React.ComponentProps<"button"> & {
  src: string
}

function ButtonWithImage({ src, className, ...props }: Props) {
  const classNames = `${styles.buttonWithImage} ${className ? className : ""}`

  return (
    <ImageLoadWrapper
      wrapperTagName="button"
      wrapperProps={{ className: classNames, ...props }}
      imageProps={{ src, alt: "Icône intégrée au bouton" }}
      loaderOptions={{ thickness: "3px" }}
    />
  );
}

export default ButtonWithImage;