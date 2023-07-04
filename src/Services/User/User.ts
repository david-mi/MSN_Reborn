import { User, updateProfile } from "firebase/auth";

export class UserService {
  static updateProfile(user: User, avatarSrc?: string, username?: string) {
    return updateProfile(user, {
      photoURL: avatarSrc ?? user.photoURL,
      displayName: username ?? user.displayName
    })
  }
}