import { AuthEmulator } from "@/tests/Emulator/AuthEmulator"
import { UserService } from ".."
import { firebase } from "@/firebase/config"
import { fetchSignInMethodsForEmail } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import type { UserProfile } from "./User"

describe("UserService", () => {
  describe("getProfile", () => {
    afterEach(async () => {
      await AuthEmulator.deleteCurrentUser()
    })

    it("Should retrieve user profileInfos", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      await AuthEmulator.createUser(email)
      const currentUser = firebase.auth.currentUser!

      const userProfileRef = doc(firebase.firestore, "users", currentUser.uid)
      const profileInfosToSet: Omit<UserProfile, "displayedStatus"> = {
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
      await AuthEmulator.deleteCurrentUser()
    })

    it("Should update user profile with given arguments", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      await AuthEmulator.createUser(email)

      const profileInfosToUpdate: Omit<UserProfile, "displayedStatus"> = {
        avatarSrc: "picture",
        username: "jean"
      }

      await UserService.setProfile(profileInfosToUpdate)
      const updatedProfile = await UserService.getProfile()

      expect(updatedProfile).toEqual({
        ...profileInfosToUpdate,
        displayedStatus: "offline"
      })
    })
  })

  describe("deleteAccount", () => {
    it("Should delete user from database", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      await AuthEmulator.createUser(email)

      await expect(UserService.deleteAccount())
        .resolves
        .not
        .toThrow()

      await expect(fetchSignInMethodsForEmail(firebase.auth, email))
        .resolves
        .toHaveLength(0)
    })
  })

  describe("checkIfVerified", async () => {
    afterEach(async () => {
      await AuthEmulator.deleteCurrentUser()
    })

    it("Should return false for a non verified user", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      await AuthEmulator.createUser(email)

      await expect(UserService.checkIfVerified())
        .resolves
        .toBe(false)
    })

    it("should return true for a verified user", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      await AuthEmulator.createAndVerifyUser(email)

      await expect(UserService.checkIfVerified())
        .resolves
        .toBe(true)
    })
  })
})