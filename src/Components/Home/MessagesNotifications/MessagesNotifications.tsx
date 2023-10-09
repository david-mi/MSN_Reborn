import { ToastContainer, toast, Id, ToastItem } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import messageNotificationSoundSrc from "/sounds/message_notification.mp3"
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef, useMemo } from "react"
import { deleteMessageToNotify } from "@/redux/slices/room/room";
import { setcurrentDisplayedRoom } from "@/redux/slices/room/room";
import MessageNotification from "./MessageNotification/MessageNotification";
import styles from "./messagesNotifications.module.css";

function MessagesNotifications() {
  const dispatch = useAppDispatch()
  const messagesToNofify = useAppSelector(({ room }) => room.messagesToNotify)
  const currentRoomId = useAppSelector(({ room }) => room.currentRoomId)
  const messageNotificationVolume = useAppSelector(({ options }) => options.user.messageNotificationVolume)
  const messageNotificationSound = useMemo(() => {
    const messageNotificationSound = new Audio(messageNotificationSoundSrc)
    messageNotificationSound.volume = messageNotificationVolume
    return messageNotificationSound
  }, [messageNotificationVolume])
  const toastsIdRefs = useRef<Map<Id, Id>>(new Map())
  const canPlayNotificationSoundRef = useRef(true)

  function handleToastClick(roomId: string) {
    dispatch(setcurrentDisplayedRoom(roomId))
  }

  useEffect(() => {
    messagesToNofify.forEach((messageToNotify) => {
      if (
        canPlayNotificationSoundRef.current === false ||
        messageToNotify.userId.startsWith("system")
      ) return

      function handleAudioEnd() {
        canPlayNotificationSoundRef.current = true
      }

      messageNotificationSound.addEventListener("ended", handleAudioEnd)
      messageNotificationSound.play()
        .catch((error) => {
          /** 
          {@link https://developer.chrome.com/blog/autoplay/}
          can't play a wizz sound unless user has interaction with DOM 
          */
          console.error(error)
          handleAudioEnd()
        })
    })
  }, [messagesToNofify, messageNotificationVolume])

  useEffect(() => {
    messagesToNofify.forEach((messageToNotify) => {
      const toastId = crypto.randomUUID() + "#" + messageToNotify.roomId
      toast(<MessageNotification messageToNotify={messageToNotify} />, {
        toastId, bodyClassName: styles.body,
        onClick: () => handleToastClick(messageToNotify.roomId)
      })

      toastsIdRefs.current.set(toastId, toastId)
      dispatch(deleteMessageToNotify(messageToNotify.id))
    })
  }, [messagesToNofify])

  useEffect(() => {
    toastsIdRefs.current.forEach((toastId) => {
      const roomIdFromToastId = (toastId as string).replace(/.+#/, "")

      if (roomIdFromToastId === currentRoomId) {
        toast.dismiss(toastId)
      }
    })
  }, [currentRoomId])

  useEffect(() => {
    const unsubscribe = toast.onChange((payload: ToastItem) => {
      if (payload.status === "removed") {
        toastsIdRefs.current.delete(payload.id)
      }
    });

    return () => unsubscribe()
  }, [])

  return (
    <div className={styles.messageNotification}>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        closeOnClick={false}
        hideProgressBar={false}
        progressClassName={styles.progressBar}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable
        theme="light"
        className={styles.toastContainer}
      />
    </div>
  );
}

export default MessagesNotifications;