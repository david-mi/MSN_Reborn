import { useEffect } from "react"
import { onSnapshot, query, collection, where, documentId } from "firebase/firestore";
import { firebase as firebaseInstance } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getContactsIds, getContactsProfile } from "@/redux/slices/contact/contact";


function useContact() {
  const dispatch = useAppDispatch()
  const contactsIds = useAppSelector(({ contact }) => contact.contactsIds)
  const contacts = useAppSelector(({ contact }) => contact.contactsList)
  const getContactsRequest = useAppSelector(({ contact }) => contact.getContactsRequest)

  useEffect(() => {
    dispatch(getContactsIds())
  }, [])

  useEffect(() => {
    if (contactsIds.length === 0) return

    const queryUserContacts = query(
      collection(firebaseInstance.firestore, "users"),
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