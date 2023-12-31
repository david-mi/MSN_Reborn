import { useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { setPlayWizz } from "@/redux/slices/room/room"
import wizzSoundSrc from "/sounds/wizz.mp3"

function useWizz() {
  const dispatch = useAppDispatch()
  const roomsList = useAppSelector(({ room }) => room.roomsList)
  const wizzSoundsRef = useRef<{ [roomId: string]: HTMLAudioElement }>({})
  const currentUserWizzVolumeOption = useAppSelector(({ options }) => options.user.wizzVolume)

  useEffect(() => {
    for (const roomId in roomsList) {
      const room = roomsList[roomId]

      if (
        room.playWizz === false ||
        wizzSoundsRef.current[roomId] !== undefined
      ) continue

      wizzSoundsRef.current[roomId] = new Audio(wizzSoundSrc)
      wizzSoundsRef.current[roomId].volume = currentUserWizzVolumeOption

      function handleAudioEnd() {
        dispatch(setPlayWizz({ roomId, playWizz: false }))
        wizzSoundsRef.current[roomId].removeEventListener("ended", handleAudioEnd)
        delete wizzSoundsRef.current[roomId]
      }

      wizzSoundsRef.current[roomId].addEventListener("ended", handleAudioEnd)
      wizzSoundsRef.current[roomId].play()
        .catch((error) => {
          /** 
          {@link https://developer.chrome.com/blog/autoplay/}
          can't play a wizz sound unless user has interaction with DOM 
          */
          console.error(error)
          handleAudioEnd()
        })
    }
  }, [roomsList, currentUserWizzVolumeOption])
}

export default useWizz