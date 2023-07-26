import { useState } from "react"
import msnLogo from "/msn-logo.png"
import styles from "./modaleLayout.module.css"
import { CloseButton } from ".."

export interface Props {
  title: string
  children: JSX.Element | JSX.Element[]
  closable?: boolean
  overlay?: boolean
  onCloseButtonClick?: () => void
}

function ModaleLayout({
  title,
  children,
  closable = false,
  onCloseButtonClick,
  overlay = false
}: Props) {
  const [closedModale, setClosedModale] = useState(false)

  if (closedModale) {
    return null
  }

  function closeModale() {
    setClosedModale(true)

    if (typeof onCloseButtonClick === "function") {
      onCloseButtonClick()
    }
  }

  const layoutContent = (
    <div className={styles.layout}>
      <header className={styles.header}>
        <img className={styles.logo} src={msnLogo} />
        <h1 className={styles.title}>{title}</h1>
        {closable && <CloseButton type="button" onClick={closeModale} />}
      </header>
      {children}
    </div >
  )

  return overlay
    ? (
      <div className={styles.overlay}>
        {layoutContent}
      </div>
    )
    : layoutContent
}

export default ModaleLayout