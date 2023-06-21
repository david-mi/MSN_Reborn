import styles from "./formLayout.module.css"

interface Props {
  children: JSX.Element | JSX.Element[]
}

const FormLayout = ({ children }: Props) => {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  )
}
export default FormLayout