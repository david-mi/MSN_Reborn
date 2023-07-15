import { ChangeEvent, ComponentProps } from "react"
import styles from "./checkbox.module.css";

type Props = ComponentProps<"input"> & {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function Checkbox(props: Props) {
  const classNames = `${styles.checkbox} ${props.className ? props.className : ""}`

  return (
    <input
      type="checkbox"
      className={classNames}
      onChange={props.onChange}
    />
  );
}

export default Checkbox;