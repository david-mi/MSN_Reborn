import type { ComponentProps } from "react";
import styles from "./gradientLayout.module.css";

type Props = ComponentProps<"div"> & {
  children: JSX.Element | JSX.Element[]
}

function GradientLayout({ children, ...props }: Props) {
  const classNames = `${styles.gradientLayout} ${props.className ? props.className : ""}`

  return (
    <div {...props} className={classNames}>
      {children}
    </div>
  );
}

export default GradientLayout;