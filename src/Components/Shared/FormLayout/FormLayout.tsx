import styles from "./formLayout.module.css"

export type Props = React.ComponentProps<"form">

function FormLayout(props: Props) {
  const { className, children } = props
  const classNames = `${styles.form} ${className ? className : ""}`

  return (
    <form className={classNames} {...props}>
      {children}
    </form>
  )
}
export default FormLayout