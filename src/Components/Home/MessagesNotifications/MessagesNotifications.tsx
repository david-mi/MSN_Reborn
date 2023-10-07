import { ToastContainer, toast, Id, ToastItem } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./messagesNotifications.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef } from "react"
import { deleteMessageToNotify } from "@/redux/slices/room/room";

function MessagesNotifications() {
  const dispatch = useAppDispatch()
  const messagesToNofify = useAppSelector(({ room }) => room.messagesToNotify)
  const currentRoomId = useAppSelector(({ room }) => room.currentRoomId)
  const toastsIdRefs = useRef<Map<Id, Id>>(new Map())

  useEffect(() => {
    messagesToNofify.forEach(({ message, id, roomId }) => {
      const toastId = crypto.randomUUID() + "#" + roomId
      toast(message, { toastId })

      toastsIdRefs.current.set(toastId, toastId)
      dispatch(deleteMessageToNotify(id))
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
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default MessagesNotifications;