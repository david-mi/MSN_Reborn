
import type { HTMLAttributes } from "react"
import styles from "./loader.module.css";

interface Props {
  className?: string
  size?: string
  thickness?: string
}

function Loader({ className, size, thickness }: Props) {
  const classNames = `${styles.loader} ${className ? className : ""}`
  const style: HTMLAttributes<HTMLSpanElement>["style"] = {
    width: size ?? "80%",
    height: size ?? "80%",
    borderWidth: thickness ?? "5px"
  }

  return (
    <span className={classNames} style={style}></span>
  );
}

export default Loader;