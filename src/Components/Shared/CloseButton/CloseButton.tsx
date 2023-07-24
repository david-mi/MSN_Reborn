import type { ComponentProps } from "react";
import { CloseIcon } from "..";
import styles from "./closeButton.module.css";

type Props = ComponentProps<"button">

function CloseButton({ className, ...props }: Props) {
  const classNames = `${styles.closeButton} ${className ? className : ""}`

  return (
    <button {...props} className={classNames}>
      <CloseIcon />
    </button>
  );
}

export default CloseButton;