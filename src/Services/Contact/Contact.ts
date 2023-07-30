import { doc, setDoc, deleteField, updateDoc, getDoc, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import type { UserProfile } from "@/redux/slices/user/types";
import type { UserProfileWithId } from "@/Components/Home/FriendRequestAlert/types";

export class ContactService {
  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static async getFriendRequestingUsersFromSnapshot(receveidFriendRequestsDocumentData: DocumentData | undefined): Promise<UserProfileWithId[]> {
    if (!receveidFriendRequestsDocumentData) {
      return []
    }

    const requestingUsersSnapshot = await Promise.all(
      Object
        .keys(receveidFriendRequestsDocumentData)
        .map((userId) => getDoc<UserProfile>(receveidFriendRequestsDocumentData[userId]))
    )

    return requestingUsersSnapshot.map((docSnap) => {
      return {
        ...docSnap.data()!,
        id: docSnap.id
      }
    })
  }

  public static async getUserContactsIds(contactsDocumentData: DocumentData | undefined) {
    if (!contactsDocumentData) {
      return []
    }

    const requestingUsersSnapshot = await Promise.all(
      Object
        .keys(contactsDocumentData)
        .map((userId) => getDoc<UserProfile>(contactsDocumentData[userId]))
    )

    return requestingUsersSnapshot.map((docSnap) => docSnap.id)
  }

  public static async getContactsProfile(contactsProfileSnapshot: QueryDocumentSnapshot<DocumentData>[]) {

    const contactsProfilesRefsPromise = contactsProfileSnapshot.map(snap => getDoc(snap.ref))

    const contactsProfile = (await Promise.all(contactsProfilesRefsPromise))
      .map((profileSnapshot) => profileSnapshot.data()!)

    return contactsProfile as UserProfileWithId[]
  }

  public static async sendFriendRequest(requestedUserId: string) {
    const receivedFriendRequestDocumentRef = doc(firebase.firestore, "receivedFriendRequests", requestedUserId)
    const currentUserRef = doc(firebase.firestore, "users", this.currentUser.uid)

    await setDoc(receivedFriendRequestDocumentRef, {
      [this.currentUser.uid]: currentUserRef
    }, { merge: true })
  }

  public static async acceptFriendRequest(requestingUserId: string) {
    await this.addUserToContacts(requestingUserId, this.currentUser.uid)
    await this.addUserToContacts(this.currentUser.uid, requestingUserId)
    return this.removeUserFromReceivedRequests(requestingUserId)
  }

  public static async denyFriendRequest(requestingUserId: string) {
    return this.removeUserFromReceivedRequests(requestingUserId)
  }

  private static async addUserToContacts(userIdToAdd: string, userIdToAccept: string) {
    const userToAcceptContactsRef = doc(firebase.firestore, "contacts", userIdToAccept)
    const userToAddRef = doc(firebase.firestore, "users", userIdToAdd)

    await setDoc(userToAcceptContactsRef, {
      [userIdToAdd]: userToAddRef
    }, { merge: true })
  }

  private static async removeUserFromReceivedRequests(userIdToRemove: string) {
    const userReceivedFriendRequestRef = doc(firebase.firestore, "receivedFriendRequests", this.currentUser.uid)

    return updateDoc(userReceivedFriendRequestRef, {
      [userIdToRemove]: deleteField()
    })
  }
}