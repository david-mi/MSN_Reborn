import { useEffect } from "react"
import { onSnapshot, query, collection, where, documentId } from "firebase/firestore";
import { firebase } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getContactsProfile, setContactsIds, initializeContactsList } from "@/redux/slices/contact/contact";
import { UserService } from "@/Services";
import { doc } from "firebase/firestore";

function useContact() {
  const dispatch = useAppDispatch()
  const contactsIds = useAppSelector(({ contact }) => contact.contactsIds)
  const contacts = useAppSelector(({ contact }) => contact.contactsList)
  const getContactsRequest = useAppSelector(({ contact }) => contact.getContactsRequest)

  useEffect(() => {
    const contactsRef = doc(firebase.firestore, "contacts", UserService.currentUser.uid)

    const unsubscribe = onSnapshot(contactsRef, async (snapshot) => {
      dispatch(setContactsIds(snapshot.data()))
      dispatch(initializeContactsList(snapshot.data()))
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (contactsIds.length === 0) return

    const queryUserContacts = query(
      collection(firebase.firestore, "users"),
      where(documentId(), "in", contactsIds)
    )

    const unsubscribe = onSnapshot(queryUserContacts, async (snapshot) => {
      dispatch(getContactsProfile(snapshot.docs))
    })

    return () => unsubscribe()
  }, [contactsIds])

  return {
    contacts,
    isLoadingContacts: getContactsRequest.status === "PENDING",
    contactsError: getContactsRequest.error
  }
}

export default useContact