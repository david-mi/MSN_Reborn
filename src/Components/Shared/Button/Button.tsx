import { useEffect, useState, useRef } from "react"
import Loader from "./Loader/Loader"
import styles from "./button.module.css"

type Props = React.ComponentProps<"button"> & {
  title: string
  theme: "monochrome" | "gradient"
  wait?: boolean
  waitTimer?: number
}

function Button({ title, theme, wait, waitTimer = 0, ...props }: Props) {
  const [waitTime, setWaitTime] = useState(waitTimer)
  const waitIntervalIdRef = useRef<NodeJS.Timer>()

  const className = `${styles.button} ${styles[theme]} ${props.className ? props.className : ""}`
  const disabled = props.disabled || wait || waitTime > 0

  useEffect(() => {
    waitIntervalIdRef.current = setInterval(() => {
      setWaitTime((previousState) => previousState - 1)
    }, 1000)

    return () => {
      if (waitIntervalIdRef.current === null) return

      clearInterval(waitIntervalIdRef.current)
    }
  }, [])

  useEffect(() => {
    if (waitTime === 0) {
      clearInterval(waitIntervalIdRef.current)
    }
  }, [waitTime])

  return (
    <button {...props} disabled={disabled} className={className}>
      {wait || waitTime
        ? <Loader className={styles.wait} waitTime={waitTime} />
        : title
      }
    </button>
  )
}

export default Button