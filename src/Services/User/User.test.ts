import { createUserOnEmulator, deleteAllUsersFromEmulator, getOobCodeForEmail } from "@/tests/utils"
import { AuthService, UserService } from ".."
import { firebase } from "@/firebase/config"
import { fetchSignInMethodsForEmail, sendEmailVerification } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import type { UserProfile } from "./User"

describe("UserService", () => {
  afterEach(async () => {
    await deleteAllUsersFromEmulator()
  })

  describe("getProfile", () => {
    it("Should retrieve user profileInfos", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await createUserOnEmulator(fakeEmail)
      const currentUser = firebase.auth.currentUser!

      const userProfileRef = doc(firebase.firestore, "users", currentUser.uid)
      const profileInfosToSet: UserProfile = {
        avatarSrc: "avatar",
        username: "patrick"
      }

      await setDoc(userProfileRef, profileInfosToSet)

      expect(UserService.getProfile(currentUser))
        .resolves
        .toEqual(profileInfosToSet)
    })
  })

  describe("setProfile", () => {
    it("Should update user profile with given arguments", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await createUserOnEmulator(fakeEmail)
      const currentUser = firebase.auth.currentUser!

      const profileInfosToUpdate: UserProfile = {
        avatarSrc: "picture",
        username: "jean"
      }

      await UserService.setProfile(currentUser, profileInfosToUpdate)
      const updatedProfile = await UserService.getProfile(currentUser)

      expect(updatedProfile).toEqual(profileInfosToUpdate)
    })
  })

  describe("deleteAccount", () => {
    it("Should delete user from database", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await createUserOnEmulator(fakeEmail)

      const currentUser = firebase.auth.currentUser!
      await expect(UserService.deleteAccount(currentUser))
        .resolves
        .not
        .toThrow()

      await expect(fetchSignInMethodsForEmail(firebase.auth, fakeEmail))
        .resolves
        .toHaveLength(0)
    })
  })

  describe("checkIfVerified", async () => {
    it("Should return false for a non verified user", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await createUserOnEmulator(fakeEmail)

      await expect(UserService.checkIfVerified())
        .resolves
        .toBe(false)
    })

    it("should return true for a verified user", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await createUserOnEmulator(fakeEmail)
      await sendEmailVerification(firebase.auth.currentUser!)
      const oobCode = await getOobCodeForEmail(fakeEmail)
      await AuthService.verifyEmail(oobCode)

      await expect(UserService.checkIfVerified())
        .resolves
        .toBe(true)
    })
  })

})