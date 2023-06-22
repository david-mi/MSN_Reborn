import { EmailValidation } from "./EmailValidation";
let emailValidation: EmailValidation

beforeEach(() => {
  emailValidation = new EmailValidation()
})

describe("emailValidation.validate", () => {
  it("Should return true for a valid email", () => {
    const email = "test@example.com";
    const emailValidationResult = emailValidation.validateFromInput(email);
    const expectedValidationResult = true

    expect(emailValidationResult).toBe(expectedValidationResult);
  });

  it("Should returns emailValidation.errorsMessages.REQUIRED error for an empty string", () => {
    const email = "";
    const emailValidationResult = emailValidation.validateFromInput(email);
    const expectedValidationResult = emailValidation.errorsMessages.REQUIRED

    expect(emailValidationResult).toEqual(expectedValidationResult);
  });

  it("Should returns emailValidation.errorsMessages.INVALID for an invalid email", () => {
    const email = "invalid-email";
    const emailValidationResult = emailValidation.validateFromInput(email);
    const expectedValidationResult = emailValidation.errorsMessages.INVALID

    expect(emailValidationResult).toEqual(expectedValidationResult);
  });
});



