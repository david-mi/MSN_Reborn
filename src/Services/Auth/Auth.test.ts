import { AuthService } from ".."
import { Emulator } from "@/tests/Emulator/Emulator"
import { FirebaseError } from "firebase/app"
import { reload, sendEmailVerification } from "firebase/auth"

describe("Auth", () => {
  describe("createUser", () => {
    afterEach(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("Should reject if email already exists in database", async () => {
      const { email, password } = await Emulator.createUser({ setProfile: true })

      await expect(AuthService.createUser(email, password))
        .rejects
        .toBeInstanceOf(FirebaseError)
    })

    it("Should create an user if email doesnt exist in database", async () => {
      const email = `mock-user-${crypto.randomUUID()}@email.com`
      const password = "myP@ssworD!"

      await expect(AuthService.createUser(email, password))
        .resolves
        .not
        .toThrow()
    })
  })

  describe("sendVerificationEmail", () => {
    afterEach(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("Should reject if email is already verified", async () => {
      await Emulator.createUser({ setProfile: true, verify: true })

      await expect(AuthService.sendVerificationEmail())
        .rejects
        .toThrow()
    })

    it("Should send an email if user is not verified", async () => {
      await Emulator.createUser()

      await expect(AuthService.sendVerificationEmail())
        .resolves
        .not
        .toThrow()
    })
  })

  describe("verifyEmail", () => {
    afterAll(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("Should reject if no oobCode is given", async () => {
      //@ts-ignore
      await expect(AuthService.verifyEmail())
        .rejects
        .toThrow()
    })

    it("Should verify an email with a correct oobCode", async () => {
      const { email, currentUser } = await Emulator.createUser()
      await sendEmailVerification(currentUser)
      const oobCode = await Emulator.getOobCodeForEmail(email)

      await expect(AuthService.verifyEmail(oobCode))
        .resolves
        .not
        .toThrow()

      await reload(currentUser)
      expect(currentUser.emailVerified).toEqual(true)
    })
  })

  describe("checkDatabaseEmailAvailability", () => {
    afterAll(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("should return true for an available email", async () => {
      const email = "newuser@test-firebase.com";

      await expect(AuthService.checkDatabaseEmailAvailability(email)).resolves.toBeTruthy()
    });

    it("should throw an error for a registered email", async () => {
      const expectedError = AuthService.errorsMessages.EMAIL_UNAVAILABLE

      const { email } = await Emulator.createUser()
      await expect(AuthService.checkDatabaseEmailAvailability(email)).rejects.toThrowError(expectedError)
    });
  });
})