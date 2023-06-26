import styles from "./formLayout.module.css"

export interface Props {
  children: JSX.Element | JSX.Element[]
  onSubmit: (event: React.FormEvent) => void
}

function FormLayout({ children, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {children}
    </form>
  )
}
export default FormLayout