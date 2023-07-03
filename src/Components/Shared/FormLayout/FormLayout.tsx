import styles from "./formLayout.module.css"

export type Props = React.ComponentProps<"form">

function FormLayout({ className, children, ...props }: Props) {
  const classNames = `${styles.form} ${className ? className : ""}`

  return (
    <form className={classNames} {...props}>
      {children}
    </form>
  )
}
export default FormLayout