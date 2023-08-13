import { firebase } from "@/firebase/config"
import { Room, RoomType } from "@/redux/slices/room/types"
import {
  doc,
  setDoc,
  arrayUnion,
  addDoc,
  collection,
  DocumentData,
  QuerySnapshot
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

  public static async createRoom(roomType: RoomType, usersId: string[]): Promise<string> {
    const roomRef = collection(firebase.firestore, "rooms")

    const roomData = {
      type: roomType,
      users: usersId
    }

    const createdRoom = await addDoc(roomRef, roomData)

    return createdRoom.id
  }

  public static async addRoomIdToUserRoomsList(roomId: string, userId: string) {
    const userRoomsListRef = doc(firebase.firestore, "roomsIds", userId)

    await setDoc(userRoomsListRef, {
      list: arrayUnion(roomId)
    }, { merge: true })
  }
}