import { useEffect, useState } from "react"
import { onSnapshot, query, collection, where, documentId } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setContactsIds,
  setContactProfile,
  initializeContactsList,
  setContactsError,
  setContactsLoaded
} from "@/redux/slices/contact/contact";
import { setRoomUserProfile } from "@/redux/slices/room/room";
import { UserService } from "@/Services";
import { doc } from "firebase/firestore";
import { UserProfile } from "@/redux/slices/user/types";

function useContact() {
  const dispatch = useAppDispatch()
  const contactsIds = useAppSelector(({ contact }) => contact.contactsIds)
  const contacts = useAppSelector(({ contact }) => contact.contactsList)
  const contactsError = useAppSelector(({ contact }) => contact.getContactsProfile.error)
  const [isFirstLoadingContacts, setIsFirstLoadingContacts] = useState(true)
  const retrieveRoomsStatus = useAppSelector(({ room }) => room.getRoomsRequest.status)

  useEffect(() => {
    if (retrieveRoomsStatus === "PENDING") return

    const contactsRef = doc(firebase.firestore, "contacts", UserService.currentUser.uid)

    const unsubscribeContactsId = onSnapshot(contactsRef, async (snapshot) => {
      dispatch(setContactsIds(snapshot.data()))
      dispatch(initializeContactsList(snapshot.data()))
    })

    return unsubscribeContactsId
  }, [retrieveRoomsStatus])

  useEffect(() => {
    if (contactsIds.length === 0) return

    const queryUserContacts = query(
      collection(firebase.firestore, "users"),
      where(documentId(), "in", contactsIds)
    )

    const unsubscribeContactsProfile = onSnapshot(queryUserContacts, async (contactsSnapshot) => {
      contactsSnapshot.docChanges().forEach((change) => {
        const contactProfile = {
          ...change.doc.data(),
          id: change.doc.id
        } as UserProfile

        switch (change.type) {
          case "added":
          case "modified": {
            dispatch(setContactProfile(contactProfile))
            dispatch(setRoomUserProfile(contactProfile))
          }
        }

        setIsFirstLoadingContacts(false)
      })

      dispatch(setContactsLoaded())
    }, (error) => {
      dispatch(setContactsError(error))
    })

    return unsubscribeContactsProfile
  }, [contactsIds])

  return {
    contacts,
    isFirstLoadingContacts,
    contactsError
  }
}

export default useContact