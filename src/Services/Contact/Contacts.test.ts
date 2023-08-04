import { AuthService, ContactService, UserService } from "..";
import { firebase } from "@/firebase/config";
import { Emulator } from "@/tests/Emulator/Emulator";
import {
  doc,
  getDoc,
  setDoc,
  DocumentReference,
  query,
  collection,
  where,
  documentId,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { User } from "firebase/auth";
import type { UserProfile } from "@/redux/slices/user/types";

describe("ContactService", () => {
  describe("getUserContactsIds", () => {
    const userToRetrieveContactsId = "2342432424242"
    let contactId: string
    let userToRetrieveContactsRef: DocumentReference
    let contactsDocumentData: DocumentData | undefined

    contactId = "55252566242424"
    userToRetrieveContactsRef = doc(firebase.firestore, "contacts", userToRetrieveContactsId)

    beforeAll(async () => {
      const userToAddRef = doc(firebase.firestore, "users", contactId)
      await setDoc(userToRetrieveContactsRef, {
        [contactId]: userToAddRef
      }, { merge: true })

      contactsDocumentData = (await getDoc(userToRetrieveContactsRef)).data()
    })

    afterAll(async () => {
      await Emulator.deleteDocument(userToRetrieveContactsRef)
    })

    it("should retrieve user contacts ids", async () => {
      const retrievedContactsIds = await ContactService.getUserContactsIds(contactsDocumentData)

      expect(retrievedContactsIds).toEqual([contactId])
    })
  })

  describe("getContactsProfile", () => {
    const userToRetrieveContactsId = "2342432424242"
    const userToRetrieveContactsRef = doc(firebase.firestore, "contacts", userToRetrieveContactsId)
    let contact: User
    let contactProfile: UserProfile
    let queryUserContactsSnapShot: QueryDocumentSnapshot<DocumentData>[]

    beforeAll(async () => {
      ({ currentUser: contact } = await Emulator.createUser({ setProfile: true }))
      contactProfile = {
        ...await UserService.getProfile(),
        id: contact.uid
      }

      const userToAddRef = doc(firebase.firestore, "users", contact.uid)
      await setDoc(userToRetrieveContactsRef, {
        [contact.uid]: userToAddRef
      }, { merge: true })

      const contactsDocumentData = (await getDoc(userToRetrieveContactsRef)).data()
      const retrievedContactsIds = await ContactService.getUserContactsIds(contactsDocumentData)

      const queryUserContacts = query(
        collection(firebase.firestore, "users"),
        where(documentId(), "in", retrievedContactsIds)
      )
      queryUserContactsSnapShot = (await getDocs(queryUserContacts)).docs
    })

    afterAll(async () => {
      await Emulator.deleteCurrentUser()
      await Emulator.deleteDocument(userToRetrieveContactsRef)
    })

    it("should retrieve user contacts profiles", async () => {
      const retrievedUserContactsProfile = await ContactService.getContactsProfile(queryUserContactsSnapShot)
      expect(retrievedUserContactsProfile[0]).toEqual(contactProfile)
    })
  })

  describe("getUsersWhoSentFriendRequest", () => {
    const requestedUserId = "23424242424242"
    let requestedUserReceivedFriendRequestsRef: DocumentReference
    let requestingUserRef: DocumentReference
    let requestingUser: User

    beforeAll(async () => {
      ({ currentUser: requestingUser } = await Emulator.createUser({ setProfile: true }))

      requestedUserReceivedFriendRequestsRef = doc(firebase.firestore, "receivedFriendRequests", requestedUserId)
      requestingUserRef = doc(firebase.firestore, "users", requestingUser.uid)

      await setDoc(requestedUserReceivedFriendRequestsRef, {
        [requestingUser.uid]: requestingUserRef
      }, { merge: true })
    })

    afterAll(async () => {
      await Emulator.deleteCurrentUser()
      await Emulator.deleteDocument(requestedUserReceivedFriendRequestsRef)
    })

    it("should retrieve friend requests user profiles for an user", async () => {
      const requestedUserReceivedFriendRequestsData = (await getDoc(requestedUserReceivedFriendRequestsRef)).data()
      const requestedUserReceivedFriendRequests = await ContactService.getUsersWhoSentFriendRequest(requestedUserReceivedFriendRequestsData)

      expect(requestedUserReceivedFriendRequests[0].id).toEqual(requestingUser.uid)
    })
  })

  describe("sendFriendRequest", () => {
    let requestedUserReceivedFriendRequestsRef: DocumentReference
    let requestedUserReceivedFriendRequestsId = "lkSDDSFé23424"
    let requestingUser: User

    beforeAll(async () => {
      ({ currentUser: requestingUser } = await Emulator.createUser({ setProfile: true }))
      requestedUserReceivedFriendRequestsRef = doc(firebase.firestore, "receivedFriendRequests", requestedUserReceivedFriendRequestsId)
    })

    afterAll(async () => {
      await Emulator.deleteCurrentUser()
      await Emulator.deleteDocument(requestedUserReceivedFriendRequestsRef)
    })

    it("should send friend request", async () => {
      await ContactService.sendFriendRequest(requestedUserReceivedFriendRequestsId)
      const requestedUserReceivedFriendRequestsData = (await getDoc(requestedUserReceivedFriendRequestsRef)).data()
      const requestedUserReceivedFriendRequests = await ContactService.getUsersWhoSentFriendRequest(requestedUserReceivedFriendRequestsData)

      expect(requestedUserReceivedFriendRequests[0].id).toEqual(requestingUser.uid)
    })
  })

  describe("acceptFriendRequest", () => {
    let requestedUserReceivedFriendRequestsRef: DocumentReference
    let requestedUserContactsRef: DocumentReference
    let requestingUserContactsRef: DocumentReference
    let requestingUser: User
    let requestedUser: User
    let requestedUserPassword: string
    let requestedUserEmail: string
    let requestingUserPassword: string
    let requestingUserEmail: string

    beforeAll(async () => {
      ({ currentUser: requestedUser, email: requestedUserEmail, password: requestedUserPassword } = await Emulator.createUser({ setProfile: true }));
      ({ currentUser: requestingUser, email: requestingUserEmail, password: requestingUserPassword } = await Emulator.createUser({ setProfile: true }));
      requestedUserReceivedFriendRequestsRef = doc(firebase.firestore, "receivedFriendRequests", requestedUser.uid)
      requestedUserContactsRef = doc(firebase.firestore, "contacts", requestedUser.uid)
      requestingUserContactsRef = doc(firebase.firestore, "contacts", requestingUser.uid)

      await ContactService.sendFriendRequest(requestedUser.uid)
    })

    afterAll(async () => {
      await Emulator.deleteCurrentUser()
      await Emulator.deleteDocument(requestedUserReceivedFriendRequestsRef)
      await Emulator.deleteDocument(requestedUserContactsRef)
      await Emulator.deleteDocument(requestingUserContactsRef)
      await AuthService.login(requestingUserEmail, requestingUserPassword)
      await Emulator.deleteCurrentUser()
    })

    it("Should add requesting user to requested user contacts and conversely, then it should remove requesting user from requested user friendRequests", async () => {
      await AuthService.login(requestedUserEmail, requestedUserPassword)
      await ContactService.acceptFriendRequest(requestingUser.uid)

      const requestedUserContactsData = (await getDoc(requestedUserContactsRef)).data()
      const requestedUserContacts = await ContactService.getUserContactsIds(requestedUserContactsData)

      expect(requestedUserContacts[0]).toEqual(requestingUser.uid)

      const requestingUserContactsData = (await getDoc(requestingUserContactsRef)).data()
      const requestingUserContacts = await ContactService.getUserContactsIds(requestingUserContactsData)

      expect(requestingUserContacts[0]).toEqual(requestedUser.uid)

      const requestedUserReceivedFriendRequestsData = (await getDoc(requestedUserReceivedFriendRequestsRef)).data()
      const requestedUserReceivedFriendRequests = await ContactService.getUsersWhoSentFriendRequest(requestedUserReceivedFriendRequestsData)

      expect(requestedUserReceivedFriendRequests).toHaveLength(0)
    })
  })

  describe("denyFriendRequest", () => {
    let requestedUserReceivedFriendRequestsRef: DocumentReference
    let requestedUserContactsRef: DocumentReference
    let requestingUserContactsRef: DocumentReference
    let requestingUser: User
    let requestedUser: User
    let requestedUserPassword: string
    let requestedUserEmail: string
    let requestingUserPassword: string
    let requestingUserEmail: string

    beforeAll(async () => {
      ({ currentUser: requestedUser, email: requestedUserEmail, password: requestedUserPassword } = await Emulator.createUser({ setProfile: true }));
      ({ currentUser: requestingUser, email: requestingUserEmail, password: requestingUserPassword } = await Emulator.createUser({ setProfile: true }));
      requestedUserReceivedFriendRequestsRef = doc(firebase.firestore, "receivedFriendRequests", requestedUser.uid)
      requestedUserContactsRef = doc(firebase.firestore, "contacts", requestedUser.uid)
      requestingUserContactsRef = doc(firebase.firestore, "contacts", requestingUser.uid)

      await ContactService.sendFriendRequest(requestedUser.uid)
    })

    afterAll(async () => {
      await Emulator.deleteCurrentUser()
      await AuthService.login(requestingUserEmail, requestingUserPassword)
      await Emulator.deleteCurrentUser()
    })

    it("Should not add requesting user to requested user contacts and conversely, then it should remove requesting user from requested user friendRequests", async () => {
      await AuthService.login(requestedUserEmail, requestedUserPassword)
      await ContactService.denyFriendRequest(requestingUser.uid)

      const requestedUserContactsData = (await getDoc(requestedUserContactsRef)).data()
      const requestedUserContacts = await ContactService.getUserContactsIds(requestedUserContactsData)

      expect(requestedUserContacts).toHaveLength(0)

      const requestingUserContactsData = (await getDoc(requestingUserContactsRef)).data()
      const requestingUserContacts = await ContactService.getUserContactsIds(requestingUserContactsData)

      expect(requestingUserContacts).toHaveLength(0)

      const requestedUserReceivedFriendRequestsData = (await getDoc(requestedUserReceivedFriendRequestsRef)).data()
      const requestedUserReceivedFriendRequests = await ContactService.getUsersWhoSentFriendRequest(requestedUserReceivedFriendRequestsData)

      expect(requestedUserReceivedFriendRequests).toHaveLength(0)
    })
  })
})