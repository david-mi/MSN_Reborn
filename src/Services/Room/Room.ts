import { firebase } from "@/firebase/config"
import { Room, RoomType } from "@/redux/slices/room/types"
import {
  addDoc,
  collection,
  DocumentData,
  QuerySnapshot,
  doc,
  setDoc
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

  public static async createRoom(roomType: RoomType, users: { [userId: string]: true }): Promise<string> {
    const roomRef = collection(firebase.firestore, "rooms")

    const roomData = {
      type: roomType,
      users
    }

    const createdRoom = await addDoc(roomRef, roomData)

    return createdRoom.id
  }

  public static async sendNewRoomInvitation(requestedUserId: string, roomName: string, roomInvitationOriginId: string) {
    const receivedRoomRequestsDocumentRef = doc(firebase.firestore, "receivedRoomRequests", requestedUserId)
    const roomInvitationOriginIdRef = doc(firebase.firestore, "rooms", roomInvitationOriginId)

    await setDoc(receivedRoomRequestsDocumentRef, {
      [this.currentUser.uid]: {
        roomName,
        roomInvitationOriginIdRef
      }
    }, { merge: true })
  }
}