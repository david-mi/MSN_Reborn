import { useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { setPlayWizz } from "@/redux/slices/room/room"
import wizzSoundSrc from "/sounds/wizz.mp3"

function useWizz() {
  const dispatch = useAppDispatch()
  const roomsList = useAppSelector(({ room }) => room.roomsList)
  const wizzSoundsRef = useRef<{ [roomId: string]: HTMLAudioElement }>({})

  useEffect(() => {
    for (const roomId in roomsList) {
      const room = roomsList[roomId]

      if (
        room.playWizz === false ||
        wizzSoundsRef.current[roomId] !== undefined
      ) continue

      wizzSoundsRef.current[roomId] = new Audio(wizzSoundSrc)

      function handleAudioEnd() {
        dispatch(setPlayWizz({ roomId, playWizz: false }))
        wizzSoundsRef.current[roomId].removeEventListener("ended", handleAudioEnd)
        delete wizzSoundsRef.current[roomId]
      }

      wizzSoundsRef.current[roomId].addEventListener("ended", handleAudioEnd)
      wizzSoundsRef.current[roomId].play()
        .catch((error) => {
          console.error(error)
          handleAudioEnd()
        })
    }
  }, [roomsList])
}

export default useWizz