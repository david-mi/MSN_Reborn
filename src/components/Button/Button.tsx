import styles from "./button.module.css"

type Props = React.ComponentProps<"button"> & {
  title: string
  theme: "monochrome" | "gradient"
}

const Button = ({ title, theme, ...props }: Props) => {
  const className = `${styles.button} ${styles[theme]}`

  return (
    <button {...props} className={className}>
      {title}
    </button>
  )
}

export default Button