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

  public static async sendNewRoomInvitation(requestedUserId: string, roomName: string, roomInvitationOriginId: string) {
    const receivedRoomRequestsDocumentRef = doc(firebase.firestore, "receivedRoomRequests", requestedUserId)
    const roomInvitationOriginRef = doc(firebase.firestore, "rooms", roomInvitationOriginId)

    await setDoc(receivedRoomRequestsDocumentRef, {
      [crypto.randomUUID()]: {
        roomName,
        roomInvitationOriginRef
      }
    }, { merge: true })
  }

  public static async acceptRoomInvitation(roomInvitationId: string, roomName: string, roomUsersId: string[]) {
    const roomUsers: { [userId: string]: true } = { [this.currentUser.uid]: true }

    roomUsersId.forEach((roomUserId) => {
      roomUsers[roomUserId] = true
    })

    await this.createRoom("manyToMany", roomUsers, roomName)
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
}