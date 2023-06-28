import { useEffect, useState, useRef } from "react"

interface Props {
  className: string
}

function Loader({ className }: Props) {
  const [dots, setDots] = useState("")
  const maxDots = 4
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    <span className={className}>
      {dots}
    </span>
  );
}

export default Loader;