import { useEffect } from "react"
import { onSnapshot } from "firebase/firestore";
import { doc } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import { UserService } from "@/Services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DatabaseNotification } from "@/redux/slices/notification/types";
import type { Notification } from "@/redux/slices/notification/types";
import { setNotifications } from "@/redux/slices/notification/notification";

function useNotification() {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(({ notification }) => notification.list)

  useEffect(() => {
    const receivedNotifications = doc(firebase.firestore, "notifications", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(receivedNotifications, async (snapshot) => {
      const notifications = snapshot.data()
      if (notifications === undefined) return

      const notificationsList: Notification[] = []

      for (const notificationId in notifications) {
        notificationsList.push({
          id: notificationId,
          ...notifications[notificationId]
        })
      }

      dispatch(setNotifications(notificationsList))
    })

    return () => unsubscribe()
  }, [])

  return {
    notifications,
    haveNotifications: notifications.length !== 0,
  }
}

export default useNotification