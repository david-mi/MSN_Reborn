import styles from "./formLayout.module.css"

interface Props {
  children: JSX.Element | JSX.Element[]
  onSubmit: (event: React.FormEvent) => void
}

const FormLayout = ({ children, onSubmit }: Props) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {children}
    </form>
  )
}
export default FormLayout