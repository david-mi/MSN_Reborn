import { ChangeEvent } from "react"
import styles from "./checkbox.module.css";

interface Props {
  onChange: (event: ChangeEvent) => void
}

function Checkbox({ onChange }: Props) {
  return (
    <input
      onChange={onChange}
      type="checkbox"
      className={styles.checkbox}
    />
  );
}

export default Checkbox;