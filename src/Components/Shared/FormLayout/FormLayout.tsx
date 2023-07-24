import { forwardRef, ForwardedRef } from "react"
import styles from "./formLayout.module.css"

export type Props = React.ComponentProps<"form">

const FormLayout = forwardRef(({ className, children, ...props }: Props, ref: ForwardedRef<HTMLFormElement>) => {
  const classNames = `${styles.form} ${className ? className : ""}`

  return (
    <form {...props} className={classNames} ref={ref}>
      {children}
    </form>
  )
})
export default FormLayout