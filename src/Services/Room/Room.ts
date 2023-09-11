import { firebase } from "@/firebase/config"
import { Room, RoomType } from "@/redux/slices/room/types"
import {
  addDoc,
  collection,
  DocumentData,
  QuerySnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteField
}
  from "firebase/firestore"

export class RoomService {
  static get currentUser() {
    const currentUser = firebase.auth.currentUser
    if (currentUser === null) {
      throw "Utilisateur non connecté !"
    }

    return currentUser
  }

  public static getRooms(contactsProfileSnapshot: QuerySnapshot<DocumentData>) {
    const contactsProfile = contactsProfileSnapshot.docs
      .map((roomSnapshot) => {
        return {
          ...roomSnapshot.data()!,
          id: roomSnapshot.id
        }
      })

    return contactsProfile as Room[]
  }

  public static async createRoom(
    roomType: RoomType,
    users: { [userId: string]: true },
    name: string | null = null
  ): Promise<string> {
    const roomRef = collection(firebase.firestore, "rooms")

    const roomData = {
      name,
      type: roomType,
      users
    }

    const createdRoom = await addDoc(roomRef, roomData)

    return createdRoom.id
  }

  public static async addCurrentUserToRoom(roomId: string): Promise<void> {
    const roomRef = doc(firebase.firestore, "rooms", roomId)

    return updateDoc(roomRef, {
      [`users.${this.currentUser.uid}`]: true
    })
  }

  public static async sendNewRoomInvitation(roomId: string, userIdToInvite: string) {
    const receivedRoomRequestsDocumentRef = doc(firebase.firestore, "receivedRoomRequests", userIdToInvite)
    const roomInvitationOriginRef = doc(firebase.firestore, "rooms", roomId)

    await setDoc(receivedRoomRequestsDocumentRef, {
      [crypto.randomUUID()]: roomInvitationOriginRef
    }, { merge: true })
  }

  public static async acceptRoomInvitation(roomInvitationId: string, roomId: string) {
    await this.addCurrentUserToRoom(roomId)
    return this.removeRoomInvitationIdFromReceivedRoomsRequest(roomInvitationId)
  }

  public static async denyRoomInvitation(roomInvitationId: string) {
    return this.removeRoomInvitationIdFromReceivedRoomsRequest(roomInvitationId)
  }

  private static async removeRoomInvitationIdFromReceivedRoomsRequest(roomInvitationId: string) {
    const receivedRoomRequestsRef = doc(firebase.firestore, "receivedRoomRequests", this.currentUser.uid)

    return updateDoc(receivedRoomRequestsRef, {
      [roomInvitationId]: deleteField()
    })
  }

  public static async leaveRoom(roomId: string) {
    const roomRef = doc(firebase.firestore, "rooms", roomId)

    return updateDoc(roomRef, {
      [`users.${this.currentUser.uid}`]: false
    })
  }
}