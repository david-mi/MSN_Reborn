import styles from "./button.module.css"

interface Props {
  title: string
  style: "monochrome" | "gradient"
  disabled?: boolean
  onClick: () => void
}

const Button = (props: Props) => {
  const {
    title,
    style,
    disabled = false,
    onClick
  } = props
  const className = `${styles.button} ${styles[style]}`

  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {title}
    </button>
  )
}
export default Button