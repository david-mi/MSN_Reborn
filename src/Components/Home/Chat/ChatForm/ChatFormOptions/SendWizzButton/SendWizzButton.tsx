import { useEffect, useRef, useState } from "react";
import { ButtonWithImage } from "@/Components/Shared";
import wizzIcon from "./wizz-icon.png"
import styles from "./sendWizzButton.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendWizz } from "@/redux/slices/room/room";

interface Props {
  roomId: string
}

function SendWizzButton({ roomId }: Props) {
  const dispatch = useAppDispatch()
  const currentUsername = useAppSelector(({ user }) => user.username)
  const playWizz = useAppSelector(({ room }) => room.roomsList[roomId].playWizz)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const wizzTimeout = 2000
  const [wizzButtonDisabled, setWizzButtonDisabled] = useState(false)

  async function handleClick() {
    if (timeoutRef.current !== null) return
    setWizzButtonDisabled(true)

    try {
      await dispatch(sendWizz({
        roomId,
        username: currentUsername
      })).unwrap()

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        setWizzButtonDisabled(false)
      }, wizzTimeout)
    } catch (error) { }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [timeoutRef])

  return (
    <div className={styles.sendWizzButtonContainer}>
      <ButtonWithImage
        type="button"
        src={wizzIcon}
        className={styles.sendWizzButton}
        onClick={handleClick}
        disabled={wizzButtonDisabled || playWizz}
      />
    </div>
  );
}

export default SendWizzButton;