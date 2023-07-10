import { AuthService } from ".."
import { AuthEmulator } from "@/tests/Emulator/AuthEmulator"
import { FirebaseError } from "firebase/app"
import { reload, sendEmailVerification } from "firebase/auth"
import { firebase } from "@/firebase/config"

describe("Auth", () => {
  describe("createUser", () => {
    afterEach(async () => {
      await AuthEmulator.deleteCurrentUser()
    })

    it("Should reject if email already exists in database", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      const password = "superPassword!123"
      await AuthEmulator.createAndVerifyUser(email)

      await expect(AuthService.createUser(email, password))
        .rejects
        .toBeInstanceOf(FirebaseError)
    })

    it("Should create an user if email doesnt exist in database", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      const password = "superPassword!123"

      await expect(AuthService.createUser(email, password))
        .resolves
        .not
        .toThrow()
    })
  })

  describe("sendVerificationEmail", () => {
    afterEach(async () => {
      await AuthEmulator.deleteCurrentUser()
    })

    it("Should reject if email is already verified", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      await AuthEmulator.createAndVerifyUser(email)

      await expect(AuthService.sendVerificationEmail())
        .rejects
        .toThrow()
    })

    it("Should send an email if user is not verified", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      await AuthEmulator.createUser(email)

      await expect(AuthService.sendVerificationEmail())
        .resolves
        .not
        .toThrow()
    })
  })

  describe("verifyEmail", () => {
    afterAll(async () => {
      await AuthEmulator.deleteCurrentUser()
    })

    it("Should reject if no oobCode is given", async () => {
      //@ts-ignore
      await expect(AuthService.verifyEmail())
        .rejects
        .toThrow()
    })

    it("Should verify an email with a correct oobCode", async () => {
      const email = `user-${crypto.randomUUID()}@email.com`
      await AuthEmulator.createUser(email)
      const currentUser = firebase.auth.currentUser!
      await sendEmailVerification(currentUser)
      const oobCode = await AuthEmulator.getOobCodeForEmail(email)

      await expect(AuthService.verifyEmail(oobCode))
        .resolves
        .not
        .toThrow()

      await reload(currentUser)
      expect(currentUser.emailVerified).toEqual(true)
    })
  })
})