import styles from "./loader.module.css";
interface Props {
  className?: string
}

function Loader({ className }: Props) {
  const classNames = `${styles.loader} ${className ? className : ""}`

  return (
    <span className={classNames}></span>
  );
}

export default Loader;