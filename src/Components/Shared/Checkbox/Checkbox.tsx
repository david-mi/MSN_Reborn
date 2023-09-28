import { ChangeEvent, ComponentProps, forwardRef } from "react"
import styles from "./checkbox.module.css";

type Props = ComponentProps<"input"> & {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = forwardRef<HTMLInputElement, Props>(({ className, children, ...props }, ref) => {
  const classNames = `${styles.checkbox} ${className ? className : ""}`

  return (
    <input
      ref={ref}
      type="checkbox"
      className={classNames}
      {...props}
    />
  );
});

export default Checkbox;