import { useEffect, useState, useRef } from "react"
import styles from "./dotLoader.module.css"

interface Props {
  className: string
  waitTime: number
}

function DotLoader({ className, waitTime }: Props) {
  const [dots, setDots] = useState("")
  const maxDots = 4
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const classNames = `${styles.dotLoader} ${className ? className : ""}`

  useEffect(() => {
    timeoutRef.current = setInterval(handleDots, 300)

    return () => {
      clearTimeout(timeoutRef.current!)
    }
  }, [])

  function handleDots() {
    setDots((previousDots) => {
      return previousDots.length >= maxDots
        ? "."
        : previousDots + "."
    })
  }

  return (
    <span className={classNames}>
      {waitTime !== 0 && <p>{waitTime}</p>}
      <p>{dots}</p>
    </span>
  );
}

export default DotLoader;