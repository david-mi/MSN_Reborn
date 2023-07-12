import { EmailValidation } from "./EmailValidation";

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
})




