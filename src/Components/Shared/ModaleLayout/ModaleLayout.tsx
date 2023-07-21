import msnLogo from "/msn-logo.png"
import styles from "./modaleLayout.module.css"

export interface Props {
  title: string
  children: JSX.Element | JSX.Element[]
}

function ModaleLayout({ title, children }: Props) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <img className={styles.logo} src={msnLogo} />
        <h1 className={styles.title}>{title}</h1>
      </header>
      {children}
    </div >
  )
}

export default ModaleLayout