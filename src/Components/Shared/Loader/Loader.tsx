
import { HTMLAttributes, forwardRef } from "react"
import styles from "./loader.module.css";

interface Props {
  className?: string
  size?: string
  thickness?: string
}

const Loader = forwardRef<HTMLSpanElement, Props>(({ className, size, thickness }, ref) => {
  const classNames = `${styles.loader} ${className ? className : ""}`
  const style: HTMLAttributes<HTMLSpanElement>["style"] = {
    width: size ?? "80%",
    borderWidth: thickness ?? "5px"
  }

  return (
    <span className={classNames} style={style} ref={ref}></span>
  );
})

export default Loader;