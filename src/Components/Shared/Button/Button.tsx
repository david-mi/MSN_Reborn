import { useEffect, useState, useRef, forwardRef } from "react"
import DotLoader from "./DotLoader/DotLoader"
import styles from "./button.module.css"

type Props = React.ComponentProps<"button"> & {
  title: string
  theme: "monochrome" | "gradient"
  wait?: boolean
  waitTimer?: number
}

const Button = forwardRef<HTMLButtonElement, Props>(({ title, theme, wait, waitTimer = 0, ...props }, ref) => {
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
    <button {...props} disabled={disabled} className={className} ref={ref}>
      {wait || waitTime
        ? <DotLoader className={styles.wait} waitTime={waitTime} />
        : title
      }
    </button>
  )
})

export default Button