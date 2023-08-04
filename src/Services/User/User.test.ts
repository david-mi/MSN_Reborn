import { Emulator } from "@/tests/Emulator/Emulator"
import { UserService } from ".."
import { firebase } from "@/firebase/config"
import { fetchSignInMethodsForEmail } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { UserProfile } from "@/redux/slices/user/types"

describe("UserService", () => {
  describe("getProfile", () => {
    afterEach(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("Should retrieve user profileInfos", async () => {
      const { currentUser } = await Emulator.createUser({ setProfile: true })

      const userProfileRef = doc(firebase.firestore, "users", currentUser.uid)
      const profileInfosToSet: Omit<UserProfile, "id"> = {
        avatarSrc: "avatar",
        username: "patrick",
        displayedStatus: "away",
        personalMessage: "hello les potes",
        email: "super-mock-user@gmail.co.uk"
      }

      await setDoc(userProfileRef, profileInfosToSet)

      expect(UserService.getProfile())
        .resolves
        .toContain({
          ...profileInfosToSet,
          id: currentUser.uid
        })
    })
  })

  describe("setProfile", () => {
    afterEach(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("Should update user profile with given arguments", async () => {
      const { email, currentUser } = await Emulator.createUser({ setProfile: true })

      const profileInfosToUpdate: Pick<UserProfile, "avatarSrc" | "username" | "email"> = {
        avatarSrc: "picture",
        username: "jean",
        email
      }

      await UserService.setProfile(profileInfosToUpdate)
      const updatedProfile = await UserService.getProfile()

      expect(updatedProfile).toEqual({
        ...profileInfosToUpdate,
        displayedStatus: "online",
        id: currentUser.uid,
        personalMessage: ""
      })
    })
  })

  describe("deleteAccount", () => {
    it("Should delete user from database", async () => {
      const { email } = await Emulator.createUser({ setProfile: true })

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
      await Emulator.deleteCurrentUser()
    })

    it("Should return false for a non verified user", async () => {
      await Emulator.createUser({ setProfile: true })

      await expect(UserService.checkIfVerified())
        .resolves
        .toBe(false)
    })

    it("should return true for a verified user", async () => {
      await Emulator.createUser({ setProfile: true, verify: true, })

      await expect(UserService.checkIfVerified())
        .resolves
        .toBe(true)
    })
  })

  describe("findByEmailAndGetId", () => {
    afterAll(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("should throw error if email is not registered", async () => {
      const email = `mock-user-${crypto.randomUUID()}@email.com`

      await expect(UserService.findByEmailAndGetId(email))
        .rejects
        .toThrow()
    })

    it("should find user id if email is registered", async () => {
      const { email, currentUser } = await Emulator.createUser({ setProfile: true })

      await expect(UserService.findByEmailAndGetId(email))
        .resolves
        .toBe(currentUser.uid)
    })
  })
})