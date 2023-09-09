import { PropsWithChildren, ComponentProps } from "react";
import styles from "./buttonWithSvg.module.css";

type Props = ComponentProps<"button">

function ButtonWithSvg({ children, className, ...props }: PropsWithChildren<Props>) {
  const classNames = `${styles.buttonWithSvg} ${className ? className : ""}`

  return (
    <button {...props} className={classNames}>
      {children}
    </button>
  );
}

export default ButtonWithSvg;