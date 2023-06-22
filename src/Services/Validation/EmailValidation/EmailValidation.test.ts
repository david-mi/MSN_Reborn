import { EmailValidation } from "./EmailValidation";

describe("EmailValidation.validate", () => {
  it("Should return true for a valid email", () => {
    const email = "test@example.com";
    const emailValidationResult = EmailValidation.validate(email);
    const expectedValidationResult = true

    expect(emailValidationResult).toBe(expectedValidationResult);
  });

  it("Should returns EmailValidation.errorsMessage.required for an required string", () => {
    const email = "";
    const emailValidationResult = EmailValidation.validate(email);
    const expectedValidationResult = EmailValidation.errorsMessage.required

    expect(emailValidationResult).toEqual(expectedValidationResult);
  });

  it("Should returns EmailValidation.errorsMessage.invalid for an invalid email", () => {
    const email = "invalid-email";
    const emailValidationResult = EmailValidation.validate(email);
    const expectedValidationResult = EmailValidation.errorsMessage.invalid

    expect(emailValidationResult).toEqual(expectedValidationResult);
  });
});
