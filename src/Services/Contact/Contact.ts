import { doc, setDoc, deleteField, updateDoc, getDoc, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { firebase } from "@/firebase/config";
import type { UserProfile } from "@/redux/slices/user/types";
import { RoomService } from "..";

export class ContactService {
  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static async getUsersWhoSentFriendRequest(receveidFriendRequestsDocumentData: DocumentData | undefined): Promise<UserProfile[]> {
    if (!receveidFriendRequestsDocumentData) {
      return []
    }

    const userWhoSentFriendRequestSnapshot = await Promise.all(
      Object
        .keys(receveidFriendRequestsDocumentData)
        .map((userId) => getDoc<UserProfile>(receveidFriendRequestsDocumentData[userId]))
    )

    return userWhoSentFriendRequestSnapshot.map((docSnap) => {
      return {
        ...docSnap.data()!,
        id: docSnap.id
      }
    })
  }

  public static async getContactsProfile(contactsProfileSnapshot: QueryDocumentSnapshot<DocumentData>[]) {
    const contactsProfilesRefsPromise = contactsProfileSnapshot.map(snap => getDoc(snap.ref))

    const contactsProfile = (await Promise.all(contactsProfilesRefsPromise))
      .map((profileSnapshot) => {
        return {
          ...profileSnapshot.data()!,
          id: profileSnapshot.id
        }
      })

    return contactsProfile as UserProfile[]
  }

  public static async sendFriendRequest(requestedUserId: string) {
    const receivedFriendRequestDocumentRef = doc(firebase.firestore, "receivedFriendRequests", requestedUserId)
    const currentUserRef = doc(firebase.firestore, "users", this.currentUser.uid)

    await setDoc(receivedFriendRequestDocumentRef, {
      [this.currentUser.uid]: currentUserRef
    }, { merge: true })
  }

  public static async acceptFriendRequest(userWhoSentFriendRequestId: string) {
    const roomId = await RoomService.createRoom("oneToOne", {
      [this.currentUser.uid]: true,
      [userWhoSentFriendRequestId]: true
    })

    await this.addUserToContacts(userWhoSentFriendRequestId, this.currentUser.uid, roomId)
    await this.addUserToContacts(this.currentUser.uid, userWhoSentFriendRequestId, roomId)

    return this.removeUserFromReceivedRequests(userWhoSentFriendRequestId)
  }

  public static async denyFriendRequest(userWhoSentFriendRequestId: string) {
    return this.removeUserFromReceivedRequests(userWhoSentFriendRequestId)
  }

  private static async addUserToContacts(userIdToAdd: string, userIdToAccept: string, roomId: string) {
    const userToAcceptContactsRef = doc(firebase.firestore, "contacts", userIdToAccept)

    await setDoc(userToAcceptContactsRef, {
      [userIdToAdd]: roomId,
    }, { merge: true })
  }

  private static async removeUserFromReceivedRequests(userIdToRemove: string) {
    const userReceivedFriendRequestRef = doc(firebase.firestore, "receivedFriendRequests", this.currentUser.uid)

    return updateDoc(userReceivedFriendRequestRef, {
      [userIdToRemove]: deleteField()
    })
  }
}