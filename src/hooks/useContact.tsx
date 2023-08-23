import { useEffect, useState } from "react"
import { onSnapshot, query, collection, where, documentId } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setContactsIds, setContactProfile, initializeContactsList, setContactsError } from "@/redux/slices/contact/contact";
import { UserService } from "@/Services";
import { doc } from "firebase/firestore";
import { Contact } from "@/redux/slices/contact/types";

function useContact(isLoadingRoomsForTheFirstTime: boolean) {
  const dispatch = useAppDispatch()
  const contactsIds = useAppSelector(({ contact }) => contact.contactsIds)
  const contacts = useAppSelector(({ contact }) => contact.contactsList)
  const contactsError = useAppSelector(({ contact }) => contact.getContactsRequest.error)
  const [isFirstLoadingContacts, setIsFirstLoadingContacts] = useState(true)

  useEffect(() => {
    if (isLoadingRoomsForTheFirstTime) return

    const contactsRef = doc(firebase.firestore, "contacts", UserService.currentUser.uid)

    const unsubscribeContactsId = onSnapshot(contactsRef, async (snapshot) => {
      dispatch(setContactsIds(snapshot.data()))
      dispatch(initializeContactsList(snapshot.data()))
    })

    return unsubscribeContactsId
  }, [isLoadingRoomsForTheFirstTime])

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
        } as Contact

        console.log(contactProfile)
        switch (change.type) {
          case "added":
          case "modified": {
            dispatch(setContactProfile(contactProfile))
          }
        }

        setIsFirstLoadingContacts(false)
      })
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