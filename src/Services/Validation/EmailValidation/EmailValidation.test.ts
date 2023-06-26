import { EmailValidation } from "./EmailValidation";
import { firebase } from "@/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth"

let emailValidation: EmailValidation

beforeEach(() => {
  emailValidation = new EmailValidation()
})

describe("EmailValidation", () => {
  describe("validate", () => {
    it("should return true for a valid email", () => {
      const email = "test@example.com";
      const emailValidationResult = emailValidation.validateFromInput(email);
      const expectedValidationResult = true

      expect(emailValidationResult).toBe(expectedValidationResult);
    });

    it("should returns the correct error for an empty string", () => {
      const email = "";
      const emailValidationResult = emailValidation.validateFromInput(email);
      const expectedValidationResult = emailValidation.errorsMessages.REQUIRED

      expect(emailValidationResult).toEqual(expectedValidationResult);
    });

    it("should returns the correct error for an invalid email", () => {
      const email = "invalid-email";
      const emailValidationResult = emailValidation.validateFromInput(email);
      const expectedValidationResult = emailValidation.errorsMessages.INVALID

      expect(emailValidationResult).toEqual(expectedValidationResult);
    });
  });

  describe("checkAvailabilityFromDatabase", () => {
    afterEach(() => {
      firebase.auth.currentUser?.delete()
    })

    it("should return true for a valid email", async () => {
      const email = "newuser@test-firebase.com";

      await expect(emailValidation.checkAvailabilityFromDatabase(email)).resolves.toBeTruthy()
    });

    it("should not add the email to unavailableEmails for a valid email", async () => {
      const email = "newuser@test-firebase.com";

      await emailValidation.checkAvailabilityFromDatabase(email);
      expect(emailValidation.unavailableEmails.has(email)).toBeFalsy();
    });

    it("should throw an error for a registered email", async () => {
      const email = "alreadyRegistered@test-firebase.com";
      const password = "superUser"
      const expectedError = emailValidation.errorsMessages.UNAVAILABLE

      await createUserWithEmailAndPassword(firebase.auth, email, password)
      await expect(emailValidation.checkAvailabilityFromDatabase(email)).rejects.toThrowError(expectedError)
    });

    it("should add the email to unavailableEmails for an already registered email", async () => {
      const email = "alreadyRegistered@test-firebase.com";
      const password = "superUser";

      await createUserWithEmailAndPassword(firebase.auth, email, password);
      try {
        await emailValidation.checkAvailabilityFromDatabase(email);
      } catch (error) { }

      expect(emailValidation.unavailableEmails.has(email)).toBeTruthy();
    });
  });

  describe("validateFromUnavailableList", () => {
    afterAll(() => {
      firebase.auth.currentUser?.delete()
    })

    it("should return true for non registerd email", async () => {
      const email = "newUser@test-firebase.com";
      expect(emailValidation.validateFromUnavailableList(email)).toBeTruthy()
    });

    it("should return an error message for a registered email", async () => {
      const email = "userToAddOnList@test-firebase.com";
      const password = "superUser"
      const expectedError = emailValidation.errorsMessages.UNAVAILABLE

      try {
        await createUserWithEmailAndPassword(firebase.auth, email, password)
        await emailValidation.checkAvailabilityFromDatabase(email)
      } catch {
        expect(emailValidation.validateFromUnavailableList(email)).toBe(expectedError)
      }
    });
  });

  describe("validateFromInputAndUnavailableList", () => {
    it("should return an error message for an invalid email", async () => {
      const email = "incorrect-email";
      const expectedResult = emailValidation.errorsMessages.INVALID

      expect(emailValidation.validateFromInputAndUnavailableList(email)).toBe(expectedResult)
    })

    it("should return true for a valid email that is not on unavailable emails list", async () => {
      const email = "validEmail@test-firebase.com";
      expect(emailValidation.validateFromInputAndUnavailableList(email)).toBeTruthy()
    })

    it("should return an error message for a valid email that is on unavailable emails list", async () => {
      const email = "validEmailButUnavailable@test-firebase.com";
      emailValidation.unavailableEmails.add(email)
      const expectedResult = emailValidation.errorsMessages.UNAVAILABLE

      expect(emailValidation.validateFromInputAndUnavailableList(email)).toBe(expectedResult)
    })
  })
})




