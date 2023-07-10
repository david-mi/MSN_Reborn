import { Emulator } from "@/tests/Emulator"
import { UserService } from ".."
import { firebase } from "@/firebase/config"
import { fetchSignInMethodsForEmail } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import type { UserProfile } from "./User"

describe("UserService", () => {
  describe("getProfile", () => {
    afterEach(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("Should retrieve user profileInfos", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await Emulator.createUser(fakeEmail)
      const currentUser = firebase.auth.currentUser!

      const userProfileRef = doc(firebase.firestore, "users", currentUser.uid)
      const profileInfosToSet: UserProfile = {
        avatarSrc: "avatar",
        username: "patrick"
      }

      await setDoc(userProfileRef, profileInfosToSet)

      expect(UserService.getProfile())
        .resolves
        .toEqual(profileInfosToSet)
    })
  })

  describe("setProfile", () => {
    afterEach(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("Should update user profile with given arguments", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await Emulator.createUser(fakeEmail)

      const profileInfosToUpdate: UserProfile = {
        avatarSrc: "picture",
        username: "jean"
      }

      await UserService.setProfile(profileInfosToUpdate)
      const updatedProfile = await UserService.getProfile()

      expect(updatedProfile).toEqual(profileInfosToUpdate)
    })
  })

  describe("deleteAccount", () => {
    it("Should delete user from database", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await Emulator.createUser(fakeEmail)

      await expect(UserService.deleteAccount())
        .resolves
        .not
        .toThrow()

      await expect(fetchSignInMethodsForEmail(firebase.auth, fakeEmail))
        .resolves
        .toHaveLength(0)
    })
  })

  describe("checkIfVerified", async () => {
    afterEach(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("Should return false for a non verified user", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await Emulator.createUser(fakeEmail)

      await expect(UserService.checkIfVerified())
        .resolves
        .toBe(false)
    })

    it("should return true for a verified user", async () => {
      const fakeEmail = `user-${crypto.randomUUID()}@email.com`
      await Emulator.createAndVerifyUser(fakeEmail)

      await expect(UserService.checkIfVerified())
        .resolves
        .toBe(true)
    })
  })
})