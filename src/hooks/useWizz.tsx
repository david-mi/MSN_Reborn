import { useEffect, useMemo } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { setPlayWizz } from "@/redux/slices/room/room"
import wizzSoundSrc from "/sounds/wizz.mp3"

function useWizz() {
  const dispatch = useAppDispatch()
  const roomsList = useAppSelector(({ room }) => room.roomsList)
  const wizzSound = useMemo(() => {
    const wizzSound = new Audio(wizzSoundSrc)
    wizzSound.volume = 0.3

    return wizzSound
  }, [])

  useEffect(() => {
    for (const roomId in roomsList) {
      const room = roomsList[roomId]

      if (room.playWizz === false) continue

      function handleAudioEnd() {
        dispatch(setPlayWizz({ roomId, playWizz: false }))
        wizzSound.removeEventListener("ended", handleAudioEnd)
      }

      wizzSound.addEventListener("ended", handleAudioEnd)
      wizzSound.play()
      break
    }

  }, [roomsList])
}

export default useWizz