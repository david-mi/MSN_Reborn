import { forwardRef, ComponentPropsWithRef } from "react"
import styles from "./formLayout.module.css"

export type Props = ComponentPropsWithRef<"form">

const FormLayout = forwardRef<HTMLFormElement, Props>(({ className, children, ...props }, ref) => {
  const classNames = `${styles.form} ${className ? className : ""}`;

  return (
    <form {...props} className={classNames} ref={ref}>
      {children}
    </form>
  );
});

export default FormLayout