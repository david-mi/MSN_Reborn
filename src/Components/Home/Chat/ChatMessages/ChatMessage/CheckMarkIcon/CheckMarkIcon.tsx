import styles from "./checkMarkIcon.module.css"

interface Props {
  className?: string
}

function CheckMarkIcon({ className }: Props) {
  const classNames = `${styles.checkMarkIcon} ${className}`

  return (
    <svg className={classNames} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
      <path fill="currentColor" d="m0 11l2-2l5 5L18 3l2 2L7 18z"></path>
    </svg>
  )
}

export default CheckMarkIcon