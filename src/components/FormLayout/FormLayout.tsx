import styles from "./formLayout.module.css"

interface Props {
  id: string
  children: JSX.Element | JSX.Element[]
}

const FormLayout = ({ children, id }: Props) => {
  return (
    <form id={id} className={styles.form}>
      {children}
    </form>
  )
}
export default FormLayout