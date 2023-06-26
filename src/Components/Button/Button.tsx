import Loader from "./Loader/Loader"
import styles from "./button.module.css"

type Props = React.ComponentProps<"button"> & {
  title: string
  theme: "monochrome" | "gradient"
  wait: boolean
}

function Button({ title, theme, wait, ...props }: Props) {
  const className = `${styles.button} ${styles[theme]}`

  return (
    <button {...props} className={className}>
      {wait
        ? <Loader className={styles.wait} />
        : title
      }
    </button>
  )
}

export default Button