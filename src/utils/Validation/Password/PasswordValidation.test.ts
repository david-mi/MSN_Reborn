import { PasswordValidation } from "./PasswordValidation";
import { PasswordInput } from "./PasswordValidation";

describe("PasswordValidation", () => {
  let passwordValidation: PasswordValidation

  beforeEach(() => {
    passwordValidation = new PasswordValidation()
  })

  describe("validate", () => {
    describe("invalid complexity", () => {
      it("should return the correct error for an empty string", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: ""
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toBe(passwordValidation.errorsMessages.REQUIRED);
      });

      it("should return the correct error for MYPASSWORD6!", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "MYPASSWORD6!"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toEqual(passwordValidation.errorsMessages.INVALID);
      });

      it("should return the correct error for mypassword6!", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "mypassword6!"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toEqual(passwordValidation.errorsMessages.INVALID);
      });

      it("should return the correct error for myPASSWORD!", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "myPASSWORD!"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toEqual(passwordValidation.errorsMessages.INVALID);
      });

      it("should return the correct error for myPASSWORD6", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "myPASSWORD6"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toEqual(passwordValidation.errorsMessages.INVALID);
      });
    });

    describe("valid complexity", () => {
      it("should return true for myPASSWORD6!", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "myPASSWORD6!"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toEqual(true);
      });

      it("should return true for !Super666", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "!Super666"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toEqual(true);
      });
    });

    describe("non indenticals", () => {
      it("should return the correct errors for 2 valids but non indenticals passwords", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "Val!dPa$$w0rd"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toEqual(true);

        const confirmPasswordEntry: PasswordInput = {
          inputName: "passwordConfirm",
          value: "d!FFeRenT6633"
        };

        const confirmPasswordValidationResult = passwordValidation.validate(confirmPasswordEntry);

        expect(confirmPasswordValidationResult).toBe(passwordValidation.errorsMessages.DIFFERENT);
      });

      it("should return the correct errors for 2 invalids and non indenticals passwords", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "InVal!dpwwww"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toBe(passwordValidation.errorsMessages.INVALID);

        const confirmPasswordEntry: PasswordInput = {
          inputName: "passwordConfirm",
          value: "InVal!d"
        };
        const confirmPasswordValidationResult = passwordValidation.validate(confirmPasswordEntry);

        expect(confirmPasswordValidationResult).toBe(passwordValidation.errorsMessages.INVALID);
      });
    });

    describe("identicals", () => {
      it("should return true for each valid and identical passwords", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "Val!dPa$$w0rd"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toEqual(true);

        const confirmPasswordEntry: PasswordInput = {
          inputName: "passwordConfirm",
          value: "Val!dPa$$w0rd"
        };

        const confirmPasswordValidationResult = passwordValidation.validate(confirmPasswordEntry);

        expect(confirmPasswordValidationResult).toEqual(true)
      });

      it("should return the correct errors for identicals passwords with invalid complexity", () => {
        const passwordEntry: PasswordInput = {
          inputName: "password",
          value: "InVal!d"
        };
        const passwordValidationResult = passwordValidation.validate(passwordEntry);

        expect(passwordValidationResult).toBe(passwordValidation.errorsMessages.INVALID);

        const confirmPasswordEntry: PasswordInput = {
          inputName: "passwordConfirm",
          value: "InVal!d"
        };
        const confirmPasswordValidationResult = passwordValidation.validate(confirmPasswordEntry);

        expect(confirmPasswordValidationResult).toBe(passwordValidation.errorsMessages.INVALID);
      });
    });
  });
})




