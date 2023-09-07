import { useEffect, useMemo, useRef } from "react"
import { onSnapshot } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setContactsIds,
  setContactProfile,
  initializeContactsList,
  setContactsError,
  setContactsLoaded
} from "@/redux/slices/contact/contact";
import { UserService } from "@/Services";
import { doc } from "firebase/firestore";
import { UserProfile } from "@/redux/slices/user/types";
import { Contact } from "@/redux/slices/contact/types";
import { removeUserFromRoomNonContactUsersProfile } from "@/redux/slices/room/room";
import { ref, onValue, Unsubscribe } from "firebase/database";
import { RoomId } from "@/redux/slices/room/types";

function useContact() {
  const dispatch = useAppDispatch()
  const contactsIds = useAppSelector(({ contact }) => contact.contactsIds)
  const contactsProfile = useAppSelector(({ contact }) => contact.contactsProfile)
  const contactsError = useAppSelector(({ contact }) => contact.getContactsProfile.error)
  const retrieveContactsStatus = useAppSelector(({ contact }) => contact.getContactsProfile.status)
  const retrieveRoomsStatus = useAppSelector(({ room }) => room.getRoomsRequest.status)
  const contactsProfileList = Object.values<Contact>(contactsProfile)

  const { onlineContactsProfileList, onlineContactsCount } = useMemo(() => {
    const onlineContactsProfileList = contactsProfileList.filter((contact) => contact.displayedStatus !== "offline")
    const onlineContactsCount = onlineContactsProfileList.length

    return { onlineContactsProfileList, onlineContactsCount }
  }, [contactsProfileList])

  const { offlineContactsProfileList, offlineContactsCount } = useMemo(() => {
    const offlineContactsProfileList = contactsProfileList.filter((contact) => contact.displayedStatus === "offline")
    const offlineContactsCount = offlineContactsProfileList.length

    return { offlineContactsProfileList, offlineContactsCount }
  }, [contactsProfileList])
  const contactsProfileUnsubscribeList = useRef<Unsubscribe[]>([])

  useEffect(() => {
    if (retrieveRoomsStatus === "PENDING") return

    const contactsRef = doc(firebase.firestore, "contacts", UserService.currentUser.uid)

    const unsubscribeContactsId = onSnapshot(contactsRef, async (snapshot) => {
      const contacts = snapshot.data() as { [contactId: string]: RoomId }
      dispatch(setContactsIds(contacts))
      dispatch(initializeContactsList(contacts))

      for (const contactId in contacts) {
        dispatch(removeUserFromRoomNonContactUsersProfile(contactId))
      }
    })

    return unsubscribeContactsId
  }, [retrieveRoomsStatus])

  useEffect(() => {
    if (contactsIds.length === 0) {
      dispatch(setContactsLoaded())
      return
    }

    for (const userId of contactsIds) {
      const contactProfileRef = ref(firebase.database, `profiles/${userId}`)

      const unsubscribeContactProfile = onValue(contactProfileRef, async (snapshot) => {
        const contactProfile = {
          ...snapshot.val(),
          id: snapshot.key
        } as UserProfile

        dispatch(setContactProfile(contactProfile))
      }, (error) => {
        dispatch(setContactsError(error))
      })

      contactsProfileUnsubscribeList.current.push(unsubscribeContactProfile)
    }

    return () => {
      contactsProfileUnsubscribeList.current.forEach((unSubscribeMessageCallback) => {
        unSubscribeMessageCallback()
        contactsProfileUnsubscribeList.current = []
      })
    }
  }, [contactsIds])

  return {
    onlineContactsProfileList,
    onlineContactsCount,
    offlineContactsProfileList,
    offlineContactsCount,
    contactsError,
    retrieveContactsStatus
  }
}

export default useContact